/**
 * This file contains helpers for the Slack Eventbot which is used for
 * adding events to noladevs.org from the Nola devs community Slack.
 */

import type { Group } from '$lib/types/group';

type createEventModalBlocksOptions = {
	groups: Array<{ text: string; value: string }>;
	locations: Array<{ text: string; value: string }>;
	channels?: Array<{ text: string; value: string }>;
	postChannelId?: string | null;
	showOtherGroupField?: boolean;
	showOtherLocationFields?: boolean;
	showAnnouncementFields?: boolean;
};

type cancelEventModalBlocksOptions = {
	events: Array<{ text: string; value: string }>;
	selectedEventId?: string | null;
	postCount?: number;
	isMissingField?: boolean;
};

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
		timeZone: 'America/Chicago',
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});

const formatEventTime = (date: Date | string) =>
	new Date(date).toLocaleTimeString('en-US', {
		timeZone: 'America/Chicago',
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
 *
 * @param event
 * @returns Slack Block Kit Blocks
 */
export const buildAnnouncementBlocks = (event: any) => {
	const startDay = new Date(event.startTime).toLocaleDateString('en-US', {
		timeZone: 'America/Chicago',
		weekday: 'long',
		month: 'short',
		day: 'numeric'
	});
	const endDay = new Date(event.endTime).toLocaleDateString('en-US', {
		timeZone: 'America/Chicago',
		weekday: 'long',
		month: 'short',
		day: 'numeric'
	});
	const startTime = new Date(event.startTime).toLocaleTimeString('en-US', {
		timeZone: 'America/Chicago',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
	const endTime = new Date(event.endTime).toLocaleTimeString('en-US', {
		timeZone: 'America/Chicago',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

	const lines = [
		`*${event.title}*`,
		event.description ? `\n${event.description}` : '',
		`\n📅 ${startDay} from ${startTime} to ${endDay === startDay ? '' : endDay + ' '}${endTime}`,
		event.locationName ? `📍 ${event.locationName}` : '',
		event.streetAddress
			? `${event.streetAddress}, ${event.locationCity}, ${event.state} ${event.locationZip ?? ''}`.trim()
			: '',
		event.locationNotes ? `_Note: ${event.locationNotes}_` : '',
		event.eventLink ? `🔗 Event: ${event.eventLink}` : '',
		event.rsvpLink ? `🎟️ RSVP: ${event.rsvpLink}` : ''
	]
		.filter(Boolean)
		.join('\n');

	return [
		{
			type: 'section',
			text: { type: 'mrkdwn', text: event.announcement || 'New Upcoming Event!' }
		},
		{ type: 'divider' },
		{
			type: 'section',
			text: { type: 'mrkdwn', text: lines }
		}
	];
};

/**
 * Every slack message the bot posted for an event: the announcement itself and
 * each repost linking back to it.
 */
type EventMessage = { channel: string; ts: string };

export const collectEventMessages = (
	event?: {
		announcementChannel?: string;
		announcementTs?: string;
		reposts?: EventMessage[];
	} | null
): EventMessage[] => [
	...(event?.announcementChannel && event?.announcementTs
		? [{ channel: event.announcementChannel, ts: event.announcementTs }]
		: []),
	...(event?.reposts ?? [])
];

/**
 * This is used for building the blocks in the
 * Cancel Event modal flow. The select lists upcoming
 * events only, and the confirmation checkbox guards
 * against an accidental deletion.
 */
export const buildCancelEventModalBlocks = (options: cancelEventModalBlocksOptions) => {
	const { events, selectedEventId, postCount = 0, isMissingField } = options;

	if (!events.length) {
		return [
			{
				type: 'section',
				block_id: 'no_events_block',
				text: { type: 'mrkdwn', text: 'There are no upcoming events to cancel.' }
			}
		];
	}

	const eventOptions = events.map((event) => ({
		text: { type: 'plain_text' as const, text: event.text },
		value: event.value
	}));

	// the modal is rebuilt when the selection changes, and a section accessory
	// select only keeps its value if it is handed back explicitly
	const selectedEventOption = eventOptions.find((option) => option.value === selectedEventId);

	// declared once so initial_options can reference the exact same shape slack
	// expects it to match
	const cleanupOption = {
		text: {
			type: 'plain_text' as const,
			text: `Also delete the ${postCount} slack ${postCount === 1 ? 'post' : 'posts'} for this event`
		},
		value: 'delete_posts'
	};

	const blocks: any[] = [
		{
			type: 'section',
			block_id: 'event_section_block',
			text: { type: 'mrkdwn', text: '* *Event to cancel*' },
			accessory: {
				type: 'static_select',
				action_id: 'event_select',
				placeholder: { type: 'plain_text', text: 'Select an event' },
				options: eventOptions,
				...(selectedEventOption ? { initial_option: selectedEventOption } : {})
			}
		},
		{
			type: 'input',
			block_id: 'cancel_reason_block',
			label: { type: 'plain_text', text: 'Reason (recorded in the audit log)' },
			element: {
				type: 'plain_text_input',
				action_id: 'cancel_reason_input',
				multiline: true,
				placeholder: { type: 'plain_text', text: 'e.g.: "Venue is unavailable, rescheduling soon"' }
			},
			optional: true
		},
		{
			type: 'input',
			block_id: 'cancel_confirm_block',
			label: { type: 'plain_text', text: '* Confirm' },
			element: {
				type: 'checkboxes',
				action_id: 'cancel_confirm_input',
				options: [
					{
						text: { type: 'plain_text' as const, text: 'Yes, delete this event from noladevs.org' },
						value: 'confirm_cancel'
					}
				]
			},
			optional: false
		},
		{
			type: 'context',
			block_id: 'cancel_warning_block',
			elements: [
				{
					type: 'mrkdwn',
					text: ':warning: Cancelling removes the event from the site permanently. This cannot be undone.'
				}
			]
		}
	];

	// nothing was ever posted for an unannounced event, so there is nothing to offer
	if (postCount > 0) {
		const confirmIndex = blocks.findIndex((block) => block.block_id === 'cancel_confirm_block');

		blocks.splice(confirmIndex, 0, {
			type: 'input',
			block_id: 'cancel_cleanup_block',
			label: { type: 'plain_text', text: 'Slack posts' },
			hint: {
				type: 'plain_text',
				text: 'Leave this unchecked to keep the original posts in place.'
			},
			element: {
				type: 'checkboxes',
				action_id: 'cancel_cleanup_input',
				options: [cleanupOption],
				// cleaning up is the usual intent, so it starts checked
				initial_options: [cleanupOption]
			},
			optional: true
		});
	}

	if (isMissingField) {
		blocks.unshift({
			type: 'context',
			block_id: 'cancel_error_block',
			elements: [{ type: 'mrkdwn', text: ':warning: Please select an event to cancel :warning: ' }]
		});
	}

	return blocks;
};

/**
 * This is used for building the blocks in the
 * Create Event modal flow. Reactivity happens with
 * the Group select and the Location select. Additional
 * fields appear when an 'Other' option is selected.
 */
export const buildCreateEventModalBlocks = (options: createEventModalBlocksOptions) => {
	const {
		groups,
		locations,
		channels = [],
		postChannelId,
		showOtherGroupField,
		showOtherLocationFields,
		showAnnouncementFields
	} = options;

	// block kit shapes vary too much between blocks for a useful inferred type
	const blocks: any[] = [
		{
			type: 'context',
			block_id: 'required_fields_note',
			elements: [
				{
					type: 'mrkdwn',
					text: 'Fields marked with * are required'
				}
			]
		},
		{
			// Meetup title
			type: 'input',
			block_id: 'title_block',
			label: { type: 'plain_text', text: '* Meetup Title' },
			element: {
				type: 'plain_text_input',
				action_id: 'title_input',
				placeholder: { type: 'plain_text', text: 'Enter meetup title' }
			},
			optional: false
		},
		{
			// Group select
			type: 'input',
			block_id: 'group_section_block',
			// dispatch_action so picking 'Other Group' still re-renders the modal
			dispatch_action: true,
			label: { type: 'plain_text', text: '* Group' },
			element: {
				type: 'static_select',
				action_id: 'group_select',
				placeholder: { type: 'plain_text', text: 'Select a group' },
				options: [
					...groups.map((g) => ({
						text: { type: 'plain_text' as const, text: g.text },
						value: g.value
					})),
					{
						text: { type: 'plain_text' as const, text: 'Other Group' },
						value: 'other-group'
					}
				]
			},
			optional: false
		}
	];

	if (showOtherGroupField) {
		blocks.push({
			type: 'input',
			block_id: 'other_group_block',
			label: {
				type: 'plain_text',
				text: '* Group Name'
			},
			element: {
				type: 'plain_text_input',
				action_id: 'other_group_input',
				placeholder: {
					type: 'plain_text',
					text: 'Group name'
				}
			},
			optional: false
		});
	}

	// Meetup description
	blocks.push({
		type: 'input',
		block_id: 'description_block',
		label: { type: 'plain_text', text: '* Meetup Description' },
		element: {
			type: 'plain_text_input',
			action_id: 'description_input',
			multiline: true,
			placeholder: { type: 'plain_text', text: 'Enter meetup description' }
		},
		optional: false
	});

	// Date / Time picker
	blocks.push(
		{
			type: 'input',
			block_id: 'starttime_block',
			label: { type: 'plain_text', text: '* Start' },
			element: {
				type: 'datetimepicker',
				action_id: 'datetimepicker_start'
			},
			optional: false
		},
		{
			type: 'input',
			block_id: 'endtime_block',
			label: { type: 'plain_text', text: '* End' },
			element: {
				type: 'datetimepicker',
				action_id: 'datetimepicker_end'
			},
			optional: false
		}
	);

	// Location dropdown
	blocks.push({
		type: 'input',
		block_id: 'location_section_block',
		// dispatch_action so picking 'Other Location' still re-renders the modal
		dispatch_action: true,
		label: { type: 'plain_text', text: '* Location' },
		element: {
			type: 'static_select',
			action_id: 'location_select',
			placeholder: { type: 'plain_text', text: 'Select a location' },
			options: [
				...locations.map((loc) => ({
					text: { type: 'plain_text' as const, text: loc.text },
					value: loc.value
				})),
				{
					text: { type: 'plain_text' as const, text: 'Other Location' },
					value: 'other-location'
				}
			]
		},
		optional: false
	});

	// Conditionally add "Other Location" address fields
	if (showOtherLocationFields) {
		blocks.push(
			{
				type: 'input',
				block_id: 'location_name_block',
				label: { type: 'plain_text', text: '* Location Name' },
				element: {
					type: 'plain_text_input',
					action_id: 'street_address_input',
					placeholder: { type: 'plain_text', text: 'Location Name' }
				},
				optional: false
			},
			{
				type: 'input',
				block_id: 'street_address_block',
				label: { type: 'plain_text', text: 'Street Address' },
				element: {
					type: 'plain_text_input',
					action_id: 'street_address_input',
					placeholder: { type: 'plain_text', text: 'Enter street address' }
				},
				optional: true
			},
			{
				type: 'input',
				block_id: 'city_block',
				label: { type: 'plain_text', text: '* City' },
				element: {
					type: 'plain_text_input',
					action_id: 'city_input',
					placeholder: { type: 'plain_text', text: 'Enter city' }
				},
				optional: false
			},
			{
				type: 'input',
				block_id: 'state_block',
				label: { type: 'plain_text', text: '* State' },
				element: {
					type: 'plain_text_input',
					action_id: 'state_input',
					placeholder: { type: 'plain_text', text: 'Enter state' }
				},
				optional: false
			},
			{
				type: 'input',
				block_id: 'zip_block',
				label: { type: 'plain_text', text: 'ZIP Code' },
				element: {
					type: 'plain_text_input',
					action_id: 'zip_input',
					placeholder: { type: 'plain_text', text: 'Enter ZIP code' }
				},
				optional: true
			}
		);
	}

	// Location notes
	blocks.push({
		type: 'input',
		block_id: 'location_notes_block',
		label: { type: 'plain_text', text: 'Location Notes' },
		element: {
			type: 'plain_text_input',
			action_id: 'location_notes_input',
			placeholder: { type: 'plain_text', text: 'e.g.: Parking is located...' }
		},
		optional: true
	});

	// Event link (optional)
	blocks.push({
		type: 'input',
		block_id: 'event_block',
		label: { type: 'plain_text', text: 'Event Link' },
		element: {
			type: 'url_text_input',
			action_id: 'event_input',
			placeholder: { type: 'plain_text', text: 'belowclevel.org, etc...' }
		},
		optional: true
	});

	// RSVP link (optional)
	blocks.push({
		type: 'input',
		block_id: 'rsvp_block',
		label: { type: 'plain_text', text: 'RSVP Link' },
		element: {
			type: 'url_text_input',
			action_id: 'rsvp_input',
			placeholder: { type: 'plain_text', text: 'eventbrite.com, etc...' }
		},
		optional: true
	});

	// Where the announcement goes. Only channels the bot was invited to are
	// listed, so a post can never fail with `not_in_channel`. Picking a channel
	// reveals the repost picker and the announcement message underneath it.
	if (channels.length) {
		const channelOptions = channels.map((channel) => ({
			text: { type: 'plain_text' as const, text: channel.text },
			value: channel.value
		}));

		blocks.push({
			type: 'input',
			block_id: 'post_channel_block',
			// dispatch_action so choosing a channel re-renders the modal with the
			// announcement fields attached
			dispatch_action: true,
			label: { type: 'plain_text', text: 'Post In' },
			hint: {
				type: 'plain_text',
				// the fields this reveals land below the fold, so the hint has to say so
				text: showAnnouncementFields
					? 'Repost and announcement options added below.'
					: 'Optionally post the event in slack. Only shows channels eventbot has been invited to'
			},
			element: {
				type: 'static_select',
				action_id: 'post_channel_select',
				placeholder: { type: 'plain_text', text: 'Select a channel' },
				options: channelOptions
			},
			optional: true
		});

		if (showAnnouncementFields) {
			blocks.push(
				{ type: 'divider', block_id: 'announcement_divider' },
				{
					type: 'section',
					block_id: 'announcement_header',
					text: { type: 'mrkdwn', text: '*Announcement*' }
				}
			);
		}

		// the post channel already has the announcement itself, so linking back to
		// it from itself is never useful
		const repostOptions = channelOptions.filter((option) => option.value !== postChannelId);

		if (showAnnouncementFields && repostOptions.length) {
			blocks.push({
				type: 'input',
				block_id: 'repost_channels_block',
				label: { type: 'plain_text', text: 'Repost In' },
				hint: {
					type: 'plain_text',
					text: 'These channels get a link to the announcement post.'
				},
				element: {
					type: 'multi_static_select',
					action_id: 'repost_channels_select',
					placeholder: { type: 'plain_text', text: 'Select channels' },
					options: repostOptions
				},
				optional: true
			});
		}
	} else {
		blocks.push({
			type: 'context',
			block_id: 'no_channels_block',
			elements: [
				{
					type: 'mrkdwn',
					text: ':information_source: Invite eventbot to a channel to announce events in slack. The event is still saved to noladevs.org either way.'
				}
			]
		});
	}

	// Announcement text, only useful once a post channel is chosen
	if (showAnnouncementFields) {
		blocks.push({
			type: 'input',
			block_id: 'announcement_block',
			label: { type: 'plain_text', text: 'Announcement Message' },
			hint: {
				type: 'plain_text',
				text: 'Additional intro text for slack posts'
			},
			element: {
				type: 'plain_text_input',
				action_id: 'announcement_input',
				placeholder: {
					type: 'plain_text',
					text: 'e.g.: "Hey @channel, we have an awesome meetup coming up!"'
				}
			},
			optional: true
		});
	}

	return blocks;
};
