/**
 * Shared helpers for the Slack Eventbot which is used for adding events to
 * noladevs.org from the Nola devs community Slack.
 *
 * Turning database rows into select options, reading values back out of a
 * submitted modal, and working out which slack messages an event owns. The
 * Block Kit itself lives in blocks.ts.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Group } from '$lib/types/group';
import { EVENT_TIME_ZONE } from '$lib/utils/event-dates';

export const createGroupOptions = (fetchedGroups: Group[]) => {
	return fetchedGroups.map((fetchedGroup: Group) => {
		return {
			text: fetchedGroup.group,
			value: fetchedGroup.slug
		};
	});
};

export const createLocationOptions = (fetchedLocations: any) => {
	return fetchedLocations.map((fetchedLoc: any) => {
		return {
			text: fetchedLoc.name,
			value: fetchedLoc.slug
		};
	});
};

const formatEventDay = (date: Date | string) =>
	new Date(date).toLocaleDateString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});

const formatEventTime = (date: Date | string) =>
	new Date(date).toLocaleTimeString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

/**
 * Slack limits static_select option labels to 75 characters.
 */
const truncateOptionText = (text: string) => (text.length > 75 ? `${text.slice(0, 72)}...` : text);

export const createEventOptions = (fetchedEvents: any[]) => {
	return fetchedEvents.map((fetchedEvent: any) => {
		return {
			text: truncateOptionText(
				`${fetchedEvent.meetupName} (${formatEventDay(fetchedEvent.start)}, ${formatEventTime(
					fetchedEvent.start
				)})`
			),
			value: String(fetchedEvent._id)
		};
	});
};

/**
 * Extract deeply nested values upon event submission
 */
export const getInputValue = (state: any, blockId: string, actionId: string): string | null => {
	return state.values?.[blockId]?.[actionId]?.value ?? null;
};

export const getDateTimeValue = (state: any, blockId: string, actionId: string): number | null => {
	return state.values?.[blockId]?.[actionId]?.selected_date_time ?? null;
};

export const getSelectValue = (state: any, blockId: string, actionId: string): string | null => {
	return state?.values?.[blockId]?.[actionId]?.selected_option?.value ?? null;
};

/**
 * Values of a multi-select or a set of checkboxes.
 */
export const getSelectedValues = (state: any, blockId: string, actionId: string): string[] => {
	const selected = state?.values?.[blockId]?.[actionId]?.selected_options ?? [];
	return selected.map((option: { value: string }) => option.value);
};

// where bugs go, so a failure the organizer sees can turn into a ticket
const ISSUES_URL = 'https://github.com/Nola-Devs/Nola-Devs-v2/issues/new';

/**
 * A slack-formatted link to a pre-filled bug report, so reporting a failure is
 * one click rather than a retelling.
 */
export const bugReportLink = (title: string, body: string) => {
	const url = `${ISSUES_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
	return `<${url}|open a bug report>`;
};

/**
 * Slack errors carry their reason in `data.error`, everything else is a network
 * or coding fault with only a message.
 */
export const describeError = (err: unknown) => {
	const code = (err as { data?: { error?: string } })?.data?.error;
	const error = err as Error | undefined;

	return {
		code: code ?? error?.name ?? 'unknown_error',
		message: error?.message ?? String(err)
	};
};

/**
 * Slack section text tops out at 3000 characters, and rejects the whole message
 * when it goes over. The default leaves room for whatever wraps the text.
 */
export const truncateSectionText = (text: string, max = 2800) =>
	text.length > max ? `${text.slice(0, max - 3)}...` : text;

/** One slack message the bot posted, as chat.delete needs it addressed. */
export type EventMessage = { channel: string; ts: string };

/** An event as far as its slack messages are concerned. */
export type AnnouncedEvent = {
	announcementChannel?: string;
	announcementTs?: string;
	reposts?: EventMessage[];
};

/**
 * Every slack message the bot posted for an event: the announcement itself and
 * each repost linking back to it.
 */
export const collectEventMessages = (event?: AnnouncedEvent | null): EventMessage[] => [
	...(event?.announcementChannel && event?.announcementTs
		? [{ channel: event.announcementChannel, ts: event.announcementTs }]
		: []),
	...(event?.reposts ?? [])
];
