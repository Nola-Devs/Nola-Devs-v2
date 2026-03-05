/**
 * This file contains helpers for the Slack Eventbot which is used for
 * adding events to noladevs.org from the Nola devs community Slack.
 */

import type { Group } from '$lib/types/group';

type createEventModalBlocksOptions = {
	groups: Array<{ text: string; value: string }>;
	locations: Array<{ text: string; value: string }>;
	showOtherGroupField?: boolean;
	showOtherLocationFields?: boolean;
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

/**
 * Extract deeply nested values upon event submission
 */
export const getInputValue = (state: any, blockId: string, actionId: string): string | null => {
	return state.values?.[blockId]?.[actionId]?.value ?? null;
};

export const getDateTimeValue = (state: any, blockId: string, actionId: string): number | null => {
	return state.values?.[blockId]?.[actionId]?.selected_date_time ?? null;
};

/**
 *
 * @param event
 * @returns Slack Block Kit Blocks
 */
export const buildAnnouncementBlocks = (event: any) => {
	const startDay = new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'long' });
	const endDay = new Date(event.endTime).toLocaleDateString('en-US', { weekday: 'long' });
	const startTime = new Date(event.startTime).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
	const endTime = new Date(event.endTime).toLocaleTimeString('en-US', {
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
 * This is used for building the blocks in the
 * Create Event modal flow. Reactivity happens with
 * the Group select and the Location select. Additional
 * fields appear when an 'Other' option is selected.
 */
export const buildCreateEventModalBlocks = (options: createEventModalBlocksOptions) => {
	const { groups, locations, showOtherGroupField, showOtherLocationFields } = options;

	const blocks = [
		{
			// Meetup title
			type: 'input',
			block_id: 'title_block',
			label: { type: 'plain_text', text: 'Meetup Title' },
			element: {
				type: 'plain_text_input',
				action_id: 'title_input',
				placeholder: { type: 'plain_text', text: 'Enter meetup title' }
			},
			optional: false
		},
		{
			// Group select
			type: 'section',
			block_id: 'group_section_block',
			text: { type: 'mrkdwn', text: '*Group*' },
			accessory: {
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
			}
		}
	];

	if (showOtherGroupField) {
		blocks.push({
			type: 'input',
			block_id: 'other_group_block',
			label: {
				type: 'plain_text',
				text: 'Group Name'
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
		label: { type: 'plain_text', text: 'Meetup Description' },
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
			label: { type: 'plain_text', text: 'Start' },
			element: {
				type: 'datetimepicker',
				action_id: 'datetimepicker_start'
			},
			optional: false
		},
		{
			type: 'input',
			block_id: 'endtime_block',
			label: { type: 'plain_text', text: 'End' },
			element: {
				type: 'datetimepicker',
				action_id: 'datetimepicker_end'
			},
			optional: false
		}
	);

	// Location dropdown
	blocks.push({
		type: 'section',
		block_id: 'location_section_block',
		text: { type: 'mrkdwn', text: '*Location*' },
		accessory: {
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
		}
	});

	// Conditionally add "Other Location" address fields
	if (showOtherLocationFields) {
		blocks.push(
			{
				type: 'input',
				block_id: 'location_name_block',
				label: { type: 'plain_text', text: 'Location Name' },
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
				label: { type: 'plain_text', text: 'City' },
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
				label: { type: 'plain_text', text: 'State' },
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

	// Announcement text
	blocks.push({
		type: 'input',
		block_id: 'announcement_block',
		label: { type: 'plain_text', text: 'Announcement Message' },
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
