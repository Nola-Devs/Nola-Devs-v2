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
 * This is used for building the blocks in the
 * Create Event modal flow. Reactivity happens with
 * the Group select and the Location select when an
 * 'Other' option is selected.
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
				action_id: 'plain_text_input-action',
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
			type: 'rich_text_input',
			action_id: 'description_input',
			placeholder: { type: 'plain_text', text: 'Enter meetup description' }
		},
		optional: false
	});

	// Date picker
	blocks.push({
		type: 'input',
		block_id: 'date_block',
		label: { type: 'plain_text', text: 'Date' },
		element: {
			type: 'datepicker',
			action_id: 'date_input',
			placeholder: { type: 'plain_text', text: 'Select a date' }
		},
		optional: false
	});

	// Time picker
	blocks.push({
		type: 'input',
		block_id: 'time_block',
		label: { type: 'plain_text', text: 'Time' },
		element: {
			type: 'timepicker',
			action_id: 'time_input',
			placeholder: { type: 'plain_text', text: 'Select a time' }
		},
		optional: false
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
				text: 'e.g.: "Hey everyone, we have an awesome meetup coming up..."'
			}
		},
		optional: true
	});

	return blocks;
};
