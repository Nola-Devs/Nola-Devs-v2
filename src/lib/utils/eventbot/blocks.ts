/**
 * Block Kit builders for the Slack Eventbot.
 *
 * These are plain Block Kit objects, the same shape Slack documents and the
 * Block Kit Builder produces, so a block can be prototyped there and pasted in.
 * The form is split into a function per section only so the composition at the
 * bottom of each builder reads as an outline of the form.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Event } from '$lib/types/event.d.ts';
import { truncateSectionText } from '$lib/utils/eventbot/helpers';
import { EVENT_TIME_ZONE } from '$lib/utils/event-dates';

type SelectOption = { text: string; value: string };

type CreateEventBlocksOptions = {
	groups: SelectOption[];
	locations: SelectOption[];
	channels?: SelectOption[];
	postChannelId?: string | null;
	showOtherGroupField?: boolean;
	showOtherLocationFields?: boolean;
	showAnnouncementFields?: boolean;
};

type CancelEventBlocksOptions = {
	events: SelectOption[];
	selectedEventId?: string | null;
	postCount?: number;
	isMissingField?: boolean;
};

/**
 * The announcement posted to the channel picked under Post In. Built from the
 * saved event so what Slack shows is what the site shows.
 */
export const buildAnnouncementBlocks = (event: Event) => {
	const startDay = new Date(event.start).toLocaleDateString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		weekday: 'long',
		month: 'short',
		day: 'numeric'
	});
	const endDay = new Date(event.end).toLocaleDateString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		weekday: 'long',
		month: 'short',
		day: 'numeric'
	});
	const startTime = new Date(event.start).toLocaleTimeString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
	const endTime = new Date(event.end).toLocaleTimeString('en-US', {
		timeZone: EVENT_TIME_ZONE,
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

	const location = event.location;

	const lines = [
		`*${event.meetupName}*`,
		event.description ? `\n${event.description}` : '',
		`\n📅 ${startDay} from ${startTime} to ${endDay === startDay ? '' : endDay + ' '}${endTime}`,
		location?.name ? `📍 ${location.name}` : '',
		location?.street
			? `${location.street}, ${location.city}, ${location.state} ${location.zip ?? ''}`.trim()
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
			text: {
				type: 'mrkdwn',
				text: truncateSectionText(event.announcement || 'New Upcoming Event!')
			}
		},
		{ type: 'divider' },
		{
			type: 'section',
			// a long description would otherwise be rejected outright, losing the
			// whole announcement rather than the tail of one field
			text: { type: 'mrkdwn', text: truncateSectionText(lines) }
		}
	];
};

/**
 * Group picker, plus a free-text name when 'Other Group' is chosen.
 */
const groupBlocks = (groups: SelectOption[], showOtherGroupField?: boolean) => {
	const blocks: any[] = [
		{
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
			label: { type: 'plain_text', text: '* Group Name' },
			element: {
				type: 'plain_text_input',
				action_id: 'other_group_input',
				placeholder: { type: 'plain_text', text: 'Group name' }
			},
			optional: false
		});
	}

	return blocks;
};

const scheduleBlocks = () => [
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
];

/**
 * Location picker, the full address fields when 'Other Location' is chosen,
 * and the notes that apply either way.
 */
const locationBlocks = (locations: SelectOption[], showOtherLocationFields?: boolean) => {
	const blocks: any[] = [
		{
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
		}
	];

	if (showOtherLocationFields) {
		blocks.push(
			{
				type: 'input',
				block_id: 'location_name_block',
				label: { type: 'plain_text', text: '* Location Name' },
				element: {
					type: 'plain_text_input',
					action_id: 'location_name_input',
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

	return blocks;
};

const linkBlocks = () => [
	{
		type: 'input',
		block_id: 'event_block',
		label: { type: 'plain_text', text: 'Event Link' },
		element: {
			type: 'url_text_input',
			action_id: 'event_input',
			placeholder: { type: 'plain_text', text: 'belowclevel.org, etc...' }
		},
		optional: true
	},
	{
		type: 'input',
		block_id: 'rsvp_block',
		label: { type: 'plain_text', text: 'RSVP Link' },
		element: {
			type: 'url_text_input',
			action_id: 'rsvp_input',
			placeholder: { type: 'plain_text', text: 'eventbrite.com, etc...' }
		},
		optional: true
	}
];

/**
 * Where the announcement goes, and what it says. Only channels the bot was
 * invited to are listed, so a post can never fail with `not_in_channel`.
 * Picking a channel reveals the repost picker and the message underneath it.
 */
const announcementBlocks = (options: CreateEventBlocksOptions) => {
	const { channels = [], postChannelId, showAnnouncementFields } = options;

	if (!channels.length) {
		return [
			{
				type: 'context',
				block_id: 'no_channels_block',
				elements: [
					{
						type: 'mrkdwn',
						text: ':information_source: Invite eventbot to a channel to announce events in slack. The event is still saved to noladevs.org either way.'
					}
				]
			}
		];
	}

	const channelOptions = channels.map((channel) => ({
		text: { type: 'plain_text' as const, text: channel.text },
		value: channel.value
	}));

	const blocks: any[] = [
		{
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
		}
	];

	if (!showAnnouncementFields) {
		return blocks;
	}

	// a visible boundary, since the fields below only just appeared
	blocks.push(
		{ type: 'divider', block_id: 'announcement_divider' },
		{
			type: 'section',
			block_id: 'announcement_header',
			text: { type: 'mrkdwn', text: '*Announcement*' }
		}
	);

	// the post channel already has the announcement itself, so linking back to
	// it from itself is never useful
	const repostOptions = channelOptions.filter((option) => option.value !== postChannelId);

	if (repostOptions.length) {
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

	return blocks;
};

/**
 * The Create Event form. Reactivity happens with the Group select, the Location
 * select, and the Post In select — each reveals fields when chosen.
 */
export const buildCreateEventModalBlocks = (options: CreateEventBlocksOptions) => [
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
	...groupBlocks(options.groups, options.showOtherGroupField),
	{
		type: 'input',
		block_id: 'description_block',
		label: { type: 'plain_text', text: '* Meetup Description' },
		hint: {
			type: 'plain_text',
			// the site shows the whole thing, slack section text stops at 3000 chars
			text: 'Shown in full on noladevs.org. A very long one is trimmed in the slack announcement.'
		},
		element: {
			type: 'plain_text_input',
			action_id: 'description_input',
			multiline: true,
			placeholder: { type: 'plain_text', text: 'Enter meetup description' }
		},
		optional: false
	},
	...scheduleBlocks(),
	...locationBlocks(options.locations, options.showOtherLocationFields),
	...linkBlocks(),
	...announcementBlocks(options)
];

/**
 * The Cancel Event form. The select lists upcoming events only, and the
 * confirmation checkbox guards against an accidental deletion.
 */
export const buildCancelEventModalBlocks = (options: CancelEventBlocksOptions) => {
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

	// slack matches initial_options against options by deep equality, so the
	// checked box has to be the very same object
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
		}
	];

	// nothing was ever posted for an unannounced event, so there is nothing to offer
	if (postCount > 0) {
		blocks.push({
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

	blocks.push(
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
	);

	if (isMissingField) {
		blocks.unshift({
			type: 'context',
			block_id: 'cancel_error_block',
			elements: [
				{ type: 'mrkdwn', text: ':warning: Please pick an event and tick the confirmation box' }
			]
		});
	}

	return blocks;
};
