/**
 * The two `view_submission` handlers for the Slack Eventbot: creating an event
 * and cancelling one. Both follow the same shape — read the modal state, write
 * to the database, reconcile Slack, then replace the form with a result modal.
 *
 * Reconciling Slack means posting the announcement and its reposts, or taking
 * them back down; those helpers live at the top of this file.
 */

import type { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import EventLocationModel from '$lib/db/models/event-locations.model';
import EventModel from '$lib/db/models/events.model';
import GroupModel from '$lib/db/models/groups.model';
import {
	type AnnouncedEvent,
	bugReportLink,
	collectEventMessages,
	describeError,
	getDateTimeValue,
	getInputValue,
	getSelectedValues,
	getSelectValue
} from '$lib/utils/eventbot/helpers';
import {
	EVENT_TIME_ZONE,
	eventDateParts,
	formatDateForSlug,
	zoneOffsetMs
} from '$lib/utils/event-dates';
import {
	AUDIT_LOG_CHANNEL_NAME,
	postErrorReport,
	postEventAuditLog
} from '$lib/utils/eventbot/audit';
import { buildAnnouncementBlocks } from '$lib/utils/eventbot/blocks';
import { cancelEventView, resultModal, type EventbotMetadata } from '$lib/utils/eventbot/modals';
import type { Event } from '$lib/types/event.d.ts';
import type { EventLocation } from '$lib/types/event-location.d.ts';
import slugify from 'slugify';

type SubmissionContext = {
	slackClient: WebClient;
	// slack's view_submission payload, shaped by the modal it came from
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any;
	metadata: EventbotMetadata;
};

/**
 * A saved event, still attached to mongoose so where its messages landed can be
 * written back onto it.
 */
type SavedEvent = Event & { save: () => Promise<unknown> };

type AnnounceOptions = {
	event: SavedEvent;
	postChannelId: string | null;
	repostChannelIds: string[];
	// whoever pressed submit, named in the error report
	userId: string;
};

/**
 * What actually reached Slack. Posting cannot be rolled into the database write,
 * so the caller reports this back instead of pretending it all worked.
 */
type AnnounceResult = {
	announced: boolean;
	// why the reposts could not go out — usually also why the announcement failed,
	// e.g. slack's own `not_in_channel`
	error?: { code: string; message: string };
	reposted: string[];
	failedReposts: string[];
};

/**
 * Posts the announcement and links to it from every repost channel, recording
 * both on the event as it goes.
 *
 * Nothing here throws: the event is already saved, and a Slack outage should not
 * lose it. What did and did not make it out is returned so the caller can say so.
 *
 * No post channel means the event was saved deliberately without announcing it.
 */
const announceEvent = async (
	slackClient: WebClient,
	options: AnnounceOptions
): Promise<AnnounceResult> => {
	const { event, postChannelId, repostChannelIds, userId } = options;

	const result: AnnounceResult = { announced: false, reposted: [], failedReposts: [] };

	if (!postChannelId) {
		return result;
	}

	// hold on to where the announcement landed so it can be edited in place later
	let announcementPermalink: string | undefined;

	try {
		const posted = await slackClient.chat.postMessage({
			channel: postChannelId,
			text: `New event: ${event.meetupName}`, // fallback for notifications
			blocks: buildAnnouncementBlocks(event)
		});

		if (posted.ts) {
			const announcementChannel = posted.channel ?? postChannelId;

			const permalink = await slackClient.chat.getPermalink({
				channel: announcementChannel,
				message_ts: posted.ts
			});
			announcementPermalink = permalink.permalink;

			event.announcementChannel = announcementChannel;
			event.announcementTs = posted.ts;
			await event.save();

			result.announced = true;
		}
	} catch (err) {
		console.error('Failed to post announcement:', err);
		result.error = describeError(err);

		await postErrorReport(slackClient, {
			action: 'post the announcement',
			userId,
			error: err,
			details: { Event: event.meetupName, Channel: `<#${postChannelId}>` }
		});
	}

	if (!announcementPermalink) {
		// without the announcement there is nothing for a repost to link to
		result.failedReposts = repostChannelIds;

		if (!result.error) {
			// the announcement itself went out, so nothing above reported this yet
			const permalinkError = new Error(
				'Slack accepted the announcement but returned no permalink to link to.'
			);
			permalinkError.name = 'no_permalink';

			console.error('Failed to get announcement permalink:', permalinkError.message);
			result.error = describeError(permalinkError);

			await postErrorReport(slackClient, {
				action: 'link the announcement into other channels',
				userId,
				error: permalinkError,
				details: { Event: event.meetupName, Channel: `<#${postChannelId}>` }
			});
		}

		return result;
	}

	// reposts are links rather than copies, so there is only ever one message to
	// edit. where each link landed is stored so cancelling can clean them up
	const reposts: Array<{ channel: string; ts: string }> = [];

	for (const channelId of repostChannelIds) {
		try {
			const reposted = await slackClient.chat.postMessage({
				channel: channelId,
				// bare permalink so slack unfurls the announcement itself
				text: announcementPermalink,
				unfurl_links: true
			});

			if (reposted.ts) {
				reposts.push({ channel: reposted.channel ?? channelId, ts: reposted.ts });
				result.reposted.push(channelId);
			} else {
				result.failedReposts.push(channelId);
			}
		} catch (err) {
			console.error(`Failed to repost announcement in ${channelId}:`, err);
			result.failedReposts.push(channelId);

			await postErrorReport(slackClient, {
				action: 'link the announcement into a channel',
				userId,
				error: err,
				details: { Event: event.meetupName, Channel: `<#${channelId}>` }
			});
		}
	}

	if (reposts.length) {
		event.reposts = reposts;
		await event.save();
	}

	return result;
};

/**
 * Takes down the announcement and every repost linking to it. One failure does
 * not stop the rest, so a message deleted by hand earlier does not strand the
 * others — but the caller is told how many were left behind.
 */
const deleteEventMessages = async (
	slackClient: WebClient,
	event: AnnouncedEvent | null,
	context: { userId: string; eventName: string }
) => {
	let deleted = 0;
	let failed = 0;

	for (const { channel, ts } of collectEventMessages(event)) {
		try {
			await slackClient.chat.delete({ channel, ts });
			deleted += 1;
		} catch (err) {
			console.error(`Failed to delete event message in ${channel}:`, err);
			failed += 1;

			await postErrorReport(slackClient, {
				action: 'delete a post for a cancelled event',
				userId: context.userId,
				error: err,
				details: { Event: context.eventName, Channel: `<#${channel}>` }
			});
		}
	}

	return { deleted, failed };
};

/**
 * Midnight in New Orleans on the day after the event ends. Mongo's TTL index
 * drops the document at that instant, so an event stays on the site for the
 * whole of its own local day.
 */
const expireAtFor = (eventEnd: Date) => {
	// the local date the event happened on, which is what "the day after" has to
	// mean — off the utc date it would roll over early for anything ending after 6pm
	const { year, month, day } = eventDateParts(eventEnd);

	// midnight utc on the following day, shifted by whatever offset the zone is on
	// that date, which lands it on midnight local
	const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

	return new Date(nextDay.getTime() + zoneOffsetMs(nextDay, EVENT_TIME_ZONE));
};

/**
 * `hack-night-03112026` — the same shape the calendar importer already produces
 * in event-parser.ts, so both sources of events give the site the same kind of
 * url. The date is the event's local one, so it matches the date on the page.
 */
const baseEventSlug = (meetupName: string, start: Date) => {
	return slugify(`${meetupName}-${formatDateForSlug(start)}`, {
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g
	});
};

/**
 * A group can run two events with the same name on one day, and
 * `getEventsByEventSlug` takes the first match — so a slug already in use gets a
 * counter rather than shadowing the event that already owns that url.
 */
const eventSlugFor = async (meetupName: string, start: Date) => {
	const base = baseEventSlug(meetupName, start);

	// one query for the whole family rather than one per attempt. `base` is
	// already slugified down to [a-z0-9-], so it is safe to build a regex from
	const taken = new Set<string | undefined>(
		(await EventModel.find({ eventSlug: new RegExp(`^${base}(-\\d+)?$`) }, 'eventSlug')).map(
			(event: { eventSlug?: string }) => event.eventSlug
		)
	);

	if (!taken.has(base)) {
		return base;
	}

	let suffix = 2;
	while (taken.has(`${base}-${suffix}`)) {
		suffix += 1;
	}

	return `${base}-${suffix}`;
};

/**
 * Everything the create form collects, with the required fields already proven
 * present and the location resolved to a single shape.
 */
type CreateEventForm = {
	title: string;
	description: string;
	start: Date;
	end: Date;
	groupSlug: string;
	groupName: string;
	location: EventLocation;
	locationNotes?: string;
	eventLink?: string;
	rsvpLink?: string;
	announcement?: string;
	postChannelId: string | null;
	repostChannelIds: string[];
};

/**
 * Reads the create form. A picked group or location is looked up, an 'Other'
 * one is taken from the fields the modal revealed.
 *
 * Returns null when a required value is missing. Slack marks every one of them
 * `optional: false`, so a field left blank never reaches here — but a group or
 * location removed from the site since the form opened no longer resolves, and
 * that lands here too.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readCreateEventForm = async (state: any): Promise<CreateEventForm | null> => {
	const title = getInputValue(state, 'title_block', 'title_input');
	const description = getInputValue(state, 'description_block', 'description_input');
	const startTime = getDateTimeValue(state, 'starttime_block', 'datetimepicker_start');
	const endTime = getDateTimeValue(state, 'endtime_block', 'datetimepicker_end');

	const groupSlug = getSelectValue(state, 'group_section_block', 'group_select');
	const locationSlug = getSelectValue(state, 'location_section_block', 'location_select');

	// Post In is optional and has no fallback: leaving it empty saves the event
	// without announcing it anywhere
	const postChannelId = getSelectValue(state, 'post_channel_block', 'post_channel_select');
	const repostChannelIds = getSelectedValues(
		state,
		'repost_channels_block',
		'repost_channels_select'
	).filter((channelId) => channelId !== postChannelId);

	let groupName;
	if (groupSlug === 'other-group') {
		groupName = getInputValue(state, 'other_group_block', 'other_group_input');
	} else {
		const group = await GroupModel.findOne({ slug: groupSlug }, 'group');
		groupName = group?.group;
	}

	let name = getInputValue(state, 'location_name_block', 'location_name_input');
	let street = getInputValue(state, 'street_address_block', 'street_address_input');
	let city = getInputValue(state, 'city_block', 'city_input');
	let locationState = getInputValue(state, 'state_block', 'state_input');
	let zip = getInputValue(state, 'zip_block', 'zip_input');

	if (locationSlug !== 'other-location') {
		const saved = await EventLocationModel.findOne({ slug: locationSlug });

		name = saved?.name ?? null;
		street = saved?.street ?? null;
		city = saved?.city ?? null;
		locationState = saved?.state ?? null;
		zip = saved?.zip ?? null;
	}

	if (
		!title ||
		!description ||
		startTime === null ||
		endTime === null ||
		!groupSlug ||
		!groupName ||
		!locationSlug ||
		!name ||
		!city ||
		!locationState
	) {
		return null;
	}

	return {
		title,
		description,
		start: new Date(startTime * 1000),
		end: new Date(endTime * 1000),
		groupSlug,
		groupName,
		location: {
			name,
			street: street ?? undefined,
			city,
			state: locationState,
			zip: zip ?? undefined,
			slug: locationSlug
		},
		locationNotes:
			getInputValue(state, 'location_notes_block', 'location_notes_input') ?? undefined,
		eventLink: getInputValue(state, 'event_block', 'event_input') ?? undefined,
		rsvpLink: getInputValue(state, 'rsvp_block', 'rsvp_input') ?? undefined,
		announcement: getInputValue(state, 'announcement_block', 'announcement_input') ?? undefined,
		postChannelId,
		repostChannelIds
	};
};

/**
 * The same closing line on every failure: the detail is already in the audit
 * channel, and here is the one-click way to tell someone who can fix it.
 */
const reportingFooter = (title: string, code: string, message: string) => {
	const body = [
		'**What happened**',
		`\`${code}\`: ${message}`,
		'',
		'**What I was doing**',
		'<!-- how you triggered it -->',
		'',
		`_Reported from the eventbot modal. Full detail is in #${AUDIT_LOG_CHANNEL_NAME}._`
	].join('\n');

	return `The full error is in #${AUDIT_LOG_CHANNEL_NAME}. If this looks like a bug, please ${bugReportLink(title, body)} or ping an admin.`;
};

const channelList = (channelIds: string[]) => channelIds.map((id) => `<#${id}>`).join(', ');

/**
 * What to tell the organizer once the event is saved. The database write has
 * already succeeded by this point, so every branch confirms that first and then
 * reports whatever Slack did or did not manage.
 */
const createEventResult = (
	form: CreateEventForm,
	announcement: AnnounceResult,
	audited: boolean
): [string, string] => {
	const auditWarning = audited
		? []
		: [
				`:warning: This change was not recorded in #${AUDIT_LOG_CHANNEL_NAME} — the bot may not be in that channel.`
			];

	const saved = `*${form.title}* has been saved to noladevs.org.`;

	// nothing was meant to be posted
	if (!form.postChannelId) {
		return [
			audited ? 'Event Created! 🎉' : 'Event Created, Not Logged',
			[
				`${saved} It was not announced anywhere — pick a channel under *Post In* to announce it.`,
				...auditWarning
			].join('\n\n')
		];
	}

	// the event is on the site but the announcement never made it out
	if (!announcement.announced) {
		const { code, message } = announcement.error ?? { code: 'unknown_error', message: '' };

		return [
			'Event Saved, Not Announced',
			[
				`:warning: ${saved}`,
				`The announcement could not be posted to <#${form.postChannelId}>, so nothing was linked either.`,
				`\`${code}\`: ${message}`,
				reportingFooter('Eventbot: could not post announcement', code, message)
			].join('\n\n')
		];
	}

	const lines = [`${saved} Announced in <#${form.postChannelId}>.`];

	if (announcement.reposted.length) {
		lines.push(`Linked in ${channelList(announcement.reposted)}.`);
	}

	if (announcement.failedReposts.length) {
		// individual reposts that failed one at a time carry no shared reason, so the
		// per-channel errors in the audit channel are all there is to point at
		const { code, message } = announcement.error ?? {
			code: 'repost_failed',
			message: 'See the audit channel for the per-channel errors.'
		};

		lines.push(
			`:warning: Could not link in ${channelList(announcement.failedReposts)}.`,
			reportingFooter('Eventbot: could not link announcement', code, message)
		);
	}

	return [
		announcement.failedReposts.length ? 'Event Created, Some Links Failed' : 'Event Created! 🎉',
		[lines.join('\n'), ...auditWarning].join('\n\n')
	];
};

export const handleCreateEventSubmission = async (context: SubmissionContext) => {
	const { slackClient, payload, metadata } = context;
	const userId = payload.user?.id ?? metadata.user_id;

	const form = await readCreateEventForm(payload.view.state);

	// slack expects a view_submission to be answered with a view, so a bare error
	// status would just show the organizer a generic connection failure
	if (!form) {
		const formError = new Error(
			'A required field was missing, or the selected group or location no longer exists.'
		);
		formError.name = 'missing_fields';

		console.error('Could not read the create form:', formError.message);

		await postErrorReport(slackClient, {
			action: 'read the submitted event form',
			userId,
			error: formError
		});

		return json(
			resultModal(
				'Event Not Saved',
				[
					':warning: Some required details were missing, so the event was not saved or announced.',
					'If the group or location you picked has since been removed from the site, pick another or choose *Other*.',
					reportingFooter(
						'Eventbot: could not read the create form',
						formError.name,
						formError.message
					)
				].join('\n\n')
			)
		);
	}

	const newEvent: Event = {
		groupSlug: form.groupSlug,
		groupName: form.groupName,
		meetupName: form.title,
		description: form.description,
		start: form.start,
		end: form.end,
		expireAt: expireAtFor(form.end),
		location: form.location,
		locationNotes: form.locationNotes,
		eventLink: form.eventLink,
		rsvpLink: form.rsvpLink,
		announcement: form.announcement,
		eventSlug: await eventSlugFor(form.title, form.start),
		createdAt: new Date()
	};

	let createdEvent;
	let saveError: unknown;
	try {
		createdEvent = await EventModel.create(newEvent);
	} catch (e) {
		console.error('Error saving to database', e);
		saveError = e;

		await postErrorReport(slackClient, {
			action: 'save the event to the database',
			userId,
			error: e,
			details: { Event: form.title, Group: form.groupName }
		});
	}

	// announcing an event that is not on the site would be worse than not
	// announcing at all, so a failed write stops here
	if (!createdEvent) {
		const { code, message } = describeError(saveError);

		return json(
			resultModal(
				'Event Not Saved',
				[
					`:warning: *${form.title}* could not be saved, so it was not announced anywhere.`,
					`\`${code}\`: ${message}`,
					reportingFooter(`Eventbot: could not save event`, code, message)
				].join('\n\n')
			)
		);
	}

	const announcement = await announceEvent(slackClient, {
		event: createdEvent,
		postChannelId: form.postChannelId,
		repostChannelIds: form.repostChannelIds,
		userId
	});

	// audit trail, only on a successful write
	const audited = await postEventAuditLog(slackClient, {
		operation: 'create',
		userId,
		before: null,
		after: createdEvent
	});

	return json(resultModal(...createEventResult(form, announcement, audited)));
};

export const handleCancelEventSubmission = async (context: SubmissionContext) => {
	const { slackClient, payload, metadata } = context;
	const userId = payload.user?.id ?? metadata.user_id;
	const state = payload.view.state;

	const selectedEventId = getSelectValue(state, 'event_section_block', 'event_select');
	const confirmed =
		getSelectedValues(state, 'cancel_confirm_block', 'cancel_confirm_input').length > 0;
	const reason = getInputValue(state, 'cancel_reason_block', 'cancel_reason_input');
	const deletePosts =
		getSelectedValues(state, 'cancel_cleanup_block', 'cancel_cleanup_input').length > 0;

	// the event select is a section accessory, so slack does not validate it for us.
	// slack does enforce the confirm checkbox, but this deletes an event permanently,
	// so it is not worth taking slack's word for it
	if (!selectedEventId || !confirmed) {
		return json({
			response_action: 'update',
			view: await cancelEventView(metadata, { selectedEventId, isMissingField: true })
		});
	}

	let cancelledEvent;
	try {
		cancelledEvent = await EventModel.findByIdAndDelete(selectedEventId);
	} catch (e) {
		console.error('Error deleting from database', e);
	}

	// the event was already removed, or the id no longer resolves
	if (!cancelledEvent) {
		return json(
			resultModal(
				'Event Not Found',
				'That event could not be found. It may have already been cancelled.'
			)
		);
	}

	// audit trail, only on a successful delete
	const audited = await postEventAuditLog(slackClient, {
		operation: 'delete',
		userId,
		before: cancelledEvent,
		after: null,
		reason
	});

	// the announcement and every link back to it are stale once the event is
	// gone, so removing them is what tells the channel, in place of a notice
	const cleanup = deletePosts
		? await deleteEventMessages(slackClient, cancelledEvent, {
				userId,
				eventName: cancelledEvent.meetupName
			})
		: { deleted: 0, failed: 0 };

	const lines = [`*${cancelledEvent.meetupName}* has been removed from noladevs.org.`];

	if (cleanup.deleted) {
		lines.push(`Deleted ${cleanup.deleted} slack ${cleanup.deleted === 1 ? 'post' : 'posts'}.`);
	}

	// a post left behind still advertises an event that no longer exists
	if (cleanup.failed) {
		lines.push(
			`:warning: ${cleanup.failed} slack ${cleanup.failed === 1 ? 'post' : 'posts'} could not be deleted and ${cleanup.failed === 1 ? 'is' : 'are'} still up. Remove ${cleanup.failed === 1 ? 'it' : 'them'} by hand.`,
			reportingFooter(
				'Eventbot: could not delete event posts',
				'delete_failed',
				'See the audit channel for the per-message errors.'
			)
		);
	}

	if (!audited) {
		lines.push(
			`:warning: This cancellation was not recorded in #${AUDIT_LOG_CHANNEL_NAME} — the bot may not be in that channel.`
		);
	}

	return json(
		resultModal(
			cleanup.failed ? 'Event Cancelled, Posts Remain' : 'Event Cancelled',
			lines.join('\n\n')
		)
	);
};
