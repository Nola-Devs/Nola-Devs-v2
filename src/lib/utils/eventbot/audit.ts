/**
 * Audit logging for the Slack Eventbot. Every successful create,
 * update, or delete is mirrored to a notifications channel so the
 * community has a record of who changed what.
 *
 * Requires the bot to be a member of the channel below, and the
 * `channels:read` scope so the channel name can be resolved to an id.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { WebClient } from '@slack/web-api';
import { describeError, truncateSectionText } from '$lib/utils/eventbot/helpers';

export const AUDIT_LOG_CHANNEL_NAME = 'eventbot-notifications';

type AuditOperation = 'create' | 'update' | 'delete';

type AuditLogOptions = {
	operation: AuditOperation;
	userId: string;
	before?: any | null;
	after?: any | null;
	reason?: string | null;
};

const OPERATION_LABELS: Record<AuditOperation, string> = {
	create: ':white_check_mark: Event Created',
	update: ':pencil2: Event Updated',
	delete: ':x: Event Cancelled'
};

// resolved once per server process, the channel id does not change
let cachedChannelId: string | null = null;

const resolveAuditChannelId = async (slackClient: WebClient): Promise<string | null> => {
	if (cachedChannelId) {
		return cachedChannelId;
	}

	let cursor: string | undefined;

	do {
		const result = await slackClient.conversations.list({
			exclude_archived: true,
			limit: 200,
			types: 'public_channel,private_channel',
			cursor
		});

		const match = result.channels?.find((channel) => channel.name === AUDIT_LOG_CHANNEL_NAME);

		if (match?.id) {
			cachedChannelId = match.id;
			return cachedChannelId;
		}

		cursor = result.response_metadata?.next_cursor || undefined;
	} while (cursor);

	return null;
};

const formatDate = (date: Date | string) =>
	new Date(date).toLocaleString('en-US', {
		timeZone: 'America/Chicago',
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

/**
 * Flatten an event document down to the fields worth logging.
 * Mongoose documents are converted so nested location values compare
 * as plain strings rather than as document internals.
 */
const toSnapshot = (event: any): Record<string, string> => {
	if (!event) {
		return {};
	}

	const plain = typeof event.toObject === 'function' ? event.toObject() : event;

	const snapshot: Record<string, string | undefined> = {
		Title: plain.meetupName,
		Group: plain.groupName,
		Start: plain.start ? formatDate(plain.start) : undefined,
		End: plain.end ? formatDate(plain.end) : undefined,
		Location: plain.location?.name,
		Address: [
			plain.location?.street,
			plain.location?.city,
			plain.location?.state,
			plain.location?.zip
		]
			.filter(Boolean)
			.join(', '),
		'Location Notes': plain.locationNotes,
		Description: plain.description,
		'Event Link': plain.eventLink,
		'RSVP Link': plain.rsvpLink,
		Announcement: plain.announcement,
		'Posted In': plain.announcementChannel ? `<#${plain.announcementChannel}>` : undefined,
		Slug: plain.eventSlug
	};

	return Object.fromEntries(
		Object.entries(snapshot)
			.filter(([, value]) => value !== undefined && value !== null && value !== '')
			.map(([key, value]) => [key, String(value)])
	);
};

const formatSnapshot = (snapshot: Record<string, string>) => {
	const entries = Object.entries(snapshot);

	if (!entries.length) {
		return '_none_';
	}

	return truncateSectionText(entries.map(([key, value]) => `• *${key}:* ${value}`).join('\n'));
};

/**
 * For updates, only the fields that actually changed are worth showing.
 */
const formatDiff = (before: Record<string, string>, after: Record<string, string>) => {
	const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
	const changed = keys.filter((key) => before[key] !== after[key]);

	if (!changed.length) {
		return '_no field changes_';
	}

	return truncateSectionText(
		changed
			.map((key) => `• *${key}:* ${before[key] ?? '_empty_'} → ${after[key] ?? '_empty_'}`)
			.join('\n')
	);
};

const buildAuditBlocks = (options: AuditLogOptions) => {
	const { operation, userId, before, after, reason } = options;

	const beforeSnapshot = toSnapshot(before);
	const afterSnapshot = toSnapshot(after);

	const blocks: any[] = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `${OPERATION_LABELS[operation]} by <@${userId}>`
			}
		},
		{ type: 'divider' }
	];

	if (operation === 'update') {
		blocks.push({
			type: 'section',
			text: { type: 'mrkdwn', text: `*Changes*\n${formatDiff(beforeSnapshot, afterSnapshot)}` }
		});
	} else {
		blocks.push(
			{
				type: 'section',
				text: { type: 'mrkdwn', text: `*Before*\n${formatSnapshot(beforeSnapshot)}` }
			},
			{
				type: 'section',
				text: { type: 'mrkdwn', text: `*After*\n${formatSnapshot(afterSnapshot)}` }
			}
		);
	}

	// cancellations are the only place a human explanation is collected, and the
	// audit channel is now the only place it is shown
	if (reason) {
		blocks.push({
			type: 'section',
			text: { type: 'mrkdwn', text: `*Reason*\n${truncateSectionText(reason)}` }
		});
	}

	return blocks;
};

/**
 * Posts an audit entry. Logging must never break the user-facing flow, so a
 * failure is logged and reported back rather than thrown.
 *
 * Returns whether the entry actually landed, so the caller can tell the user
 * when the record they expect to exist does not.
 */
export const postEventAuditLog = async (
	slackClient: WebClient,
	options: AuditLogOptions
): Promise<boolean> => {
	const { operation, userId, before, after, reason } = options;

	try {
		const channelId = await resolveAuditChannelId(slackClient);

		if (!channelId) {
			console.error(
				`Audit log skipped: #${AUDIT_LOG_CHANNEL_NAME} not found or bot is not a member.`
			);
			return false;
		}

		const eventName = after?.meetupName ?? before?.meetupName ?? 'event';

		await slackClient.chat.postMessage({
			channel: channelId,
			text: `Event ${operation}d: ${eventName} by <@${userId}>`, // fallback for notifications
			blocks: buildAuditBlocks({ operation, userId, before, after, reason })
		});

		return true;
	} catch (err) {
		console.error('Failed to post audit log:', err);
		return false;
	}
};

export type ErrorReport = {
	// what the bot was attempting, in plain words: 'post the announcement'
	action: string;
	userId: string;
	error: unknown;
	// whatever narrows it down: the event title, the channel it was aimed at
	details?: Record<string, string | undefined>;
};

/**
 * Posts the full detail of a failure to the audit channel, so what the organizer
 * sees in the modal can stay short while the stack trace is still recoverable by
 * someone who can act on it.
 *
 * Never throws — it is already handling one failure and must not cause another.
 */
export const postErrorReport = async (slackClient: WebClient, report: ErrorReport) => {
	const { action, userId, error, details = {} } = report;
	const { code, message } = describeError(error);

	try {
		const channelId = await resolveAuditChannelId(slackClient);

		if (!channelId) {
			console.error(
				`Error report skipped: #${AUDIT_LOG_CHANNEL_NAME} not found or bot is not a member.`
			);
			return;
		}

		const context = Object.entries(details)
			.filter(([, value]) => value)
			.map(([key, value]) => `• *${key}:* ${value}`)
			.join('\n');

		const stack = error instanceof Error && error.stack ? error.stack : String(error);

		const blocks: any[] = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `:rotating_light: *Eventbot could not ${action}* — triggered by <@${userId}>`
				}
			},
			{ type: 'divider' },
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: truncateSectionText(`*Error*\n• *Code:* \`${code}\`\n• *Message:* ${message}`)
				}
			}
		];

		if (context) {
			blocks.push({
				type: 'section',
				text: { type: 'mrkdwn', text: truncateSectionText(`*Context*\n${context}`) }
			});
		}

		blocks.push({
			type: 'section',
			text: { type: 'mrkdwn', text: truncateSectionText(`*Stack*\n\`\`\`${stack}\`\`\``) }
		});

		await slackClient.chat.postMessage({
			channel: channelId,
			text: `Eventbot error: ${code} while trying to ${action}`, // fallback for notifications
			blocks
		});
	} catch (err) {
		console.error('Failed to post error report:', err);
	}
};
