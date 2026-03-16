import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
import EventLocationModel from '$lib/db/models/event-locations.model';
import EventModel from '$lib/db/models/events.model';
import {
	buildCreateEventModalBlocks,
	buildAnnouncementBlocks,
	createGroupOptions,
	createLocationOptions,
	getDateTimeValue,
	getInputValue
} from '$lib/utils/eventbot';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { Group } from '$lib/types/group';
import slugify from 'slugify';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	console.log('submit endpoint reached');
	const formData = await request.formData();
	const payloadString = formData.get('payload') as string;

	if (!payloadString) {
		return json({ error: 'No payload found' }, { status: 400 });
	}

	const payload = JSON.parse(payloadString);
	const state = payload.view.state;
	console.log('🚀 ~ POST ~ state:', state);

	let metadata;
	try {
		metadata =
			typeof payload.view.private_metadata === 'string'
				? JSON.parse(payload.view.private_metadata)
				: payload.view.private_metadata;
	} catch (err) {
		console.error('Metadata parse error:', err);
		console.log('Raw metadata:', payload.view.private_metadata);
		return new Response('', { status: 200 });
	}

	console.log('Payload type:', payload.type);
	if (payload.type === 'block_actions') {
		const action = payload.actions[0];
		console.log('action.action_id', action.action_id);

		if (action.action_id === 'create_event') {
			const groups: Group[] = await GroupModel.find({}, 'group slug');
			const groupOptions = createGroupOptions(groups);
			const locations = await EventLocationModel.find({});
			const locationOptions = createLocationOptions(locations);

			const updatedMetadata = {
				...metadata,
				groups,
				locations,
				showOtherGroupField: false,
				showOtherLocationFields: false
			};

			await slackClient.views.push({
				trigger_id: payload.trigger_id,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks: buildCreateEventModalBlocks({
						groups: groupOptions,
						locations: locationOptions,
						showOtherGroupField: metadata.showOtherGroupField,
						showOtherLocationFields: metadata.showOtherLocationFields
					})
				}
			});
		}

		if (action.action_id === 'group_select') {
			const selectedGroup = action.selected_option.value;
			console.log('🚀 ~ POST ~ selectedGroup:', selectedGroup);
			const groupOptions = createGroupOptions(metadata.groups);
			const locationOptions = createLocationOptions(metadata.locations);
			// console.log('🚀 ~ POST ~ metadata:', metadata);

			const updatedMetadata = {
				...metadata,
				groups: metadata.groups,
				locations: metadata.locations,
				showOtherGroupField: selectedGroup === 'other-group',
				showOtherLocationFields: metadata.showOtherLocationFields
			};

			const blocks = buildCreateEventModalBlocks({
				groups: groupOptions,
				locations: locationOptions,
				showOtherGroupField: updatedMetadata.showOtherGroupField,
				showOtherLocationFields: updatedMetadata.showOtherLocationFields
			});

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks
				}
			});
		}

		if (action.action_id === 'location_select') {
			const selectedLocation = action.selected_option.value;
			console.log('🚀 ~ POST ~ selectedLocation:', selectedLocation);
			const groupOptions = createGroupOptions(metadata.groups);
			const locationOptions = createLocationOptions(metadata.locations);
			// console.log('🚀 ~ POST ~ metadata:', metadata);

			const updatedMetadata = {
				...metadata,
				groups: metadata.groups,
				locations: metadata.locations,
				showOtherGroupField: metadata.showOtherGroupField,
				showOtherLocationFields: selectedLocation === 'other-location'
			};

			const blocks = buildCreateEventModalBlocks({
				groups: groupOptions,
				locations: locationOptions,
				showOtherGroupField: updatedMetadata.showOtherGroupField,
				showOtherLocationFields: updatedMetadata.showOtherLocationFields
			});

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks
				}
			});
		}

		if (action.action_id === 'edit_event') {
			// then do this
		}

		if (action.action_id === 'cancel_event') {
			// then do this
		}
	}

	if (payload.type === 'view_submission' && payload.view.callback_id === 'create_event_modal') {
		const state = payload.view.state;

		const title = getInputValue(state, 'title_block', 'title_input');
		const description = getInputValue(state, 'description_block', 'description_input');
		const startTime = getDateTimeValue(state, 'starttime_block', 'datetimepicker_start');
		const endTime = getDateTimeValue(state, 'endtime_block', 'datetimepicker_end');
		const eventLink = getInputValue(state, 'event_block', 'event_input');
		const rsvpLink = getInputValue(state, 'rsvp_block', 'rsvp_input');
		const locationNotes = getInputValue(state, 'location_notes_block', 'location_notes_input');
		const announcement = getInputValue(state, 'announcement_block', 'announcement_input');

		const selectedGroup =
			state.values?.group_section_block?.group_select?.selected_option?.value ?? 'other-group';
		const selectedLocation =
			state.values?.location_section_block?.location_select?.selected_option?.value ??
			'other-location';

		let groupName;
		let locationName = getInputValue(state, 'location_name_block', 'street_address_input');
		let streetAddress = getInputValue(state, 'street_address_block', 'street_address_input');
		let locationCity = getInputValue(state, 'city_block', 'city_input');
		let locationState = getInputValue(state, 'state_block', 'state_input');
		let locationZip = getInputValue(state, 'zip_block', 'zip_input');

		if (selectedGroup !== 'other-group') {
			const { group } = await GroupModel.findOne({ slug: selectedGroup }, 'group');
			groupName = group;
		} else {
			groupName = getInputValue(state, 'other_group_block', 'other_group_input');
		}

		if (selectedLocation !== 'other-location') {
			const { name, street, city, state, zip } = await EventLocationModel.findOne({
				slug: selectedLocation
			});

			locationName = name;
			streetAddress = street;
			locationCity = city;
			locationState = state;
			locationZip = zip;
		}

		const startDate = new Date(startTime * 1000);
		const endDate = new Date(endTime * 1000);

		const eventData = {
			title,
			groupSlug: selectedGroup === 'other-group' ? 'other-group' : selectedGroup,
			groupName,
			description,
			startTime: startDate,
			endTime: endDate,
			eventLink,
			rsvpLink,
			locationSlug: selectedLocation,
			locationName,
			streetAddress,
			locationCity,
			state: locationState,
			locationZip,
			locationNotes,
			announcement,
			channelId: metadata.channel_id,
			createdBy: metadata.user_id,
			createdAt: new Date()
		};

		const setExpireAt = (eventEnd: Date) => {
			const expirationDate = new Date(eventEnd);
			expirationDate.setUTCDate(expirationDate.getUTCDate() + 1);
			expirationDate.setUTCHours(0);
			return expirationDate;
		};

		const eventSlug = slugify(`${groupName} ${eventData.startTime}`, {
			replacement: '-',
			lower: true,
			locale: 'en'
		});

		// --- Save to MongoDB ---
		const newEvent: Event = {
			groupSlug: eventData.groupSlug,
			groupName,
			meetupName: eventData.title,
			description: eventData.description,
			start: eventData.startTime,
			end: eventData.endTime,
			expireAt: setExpireAt(eventData.endTime),
			location: {
				name: eventData.locationName,
				street: eventData.streetAddress,
				city: eventData.locationCity,
				state: eventData.state,
				zip: eventData.locationZip,
				slug: eventData.locationSlug
			},
			locationNotes: eventData.locationNotes,
			eventLink: eventData.eventLink,
			rsvpLink: eventData.rsvpLink,
			announcement: eventData.announcement,
			eventSlug,
			createdAt: eventData.createdAt
		};

		try {
			await EventModel.create(newEvent);
		} catch (e) {
			console.error('Error saving to database', e);
		}

		console.log('📦 Raw event data:', eventData);
		console.log('📦 Event data to save:', newEvent);

		// --- Post announcement to Slack ---
		try {
			await slackClient.chat.postMessage({
				channel: metadata.channel_id,
				text: `New event: ${title}`, // fallback for notifications
				blocks: buildAnnouncementBlocks(eventData)
			});
		} catch (err) {
			console.error('Failed to post announcement:', err);
		}

		// --- Return success modal (replaces the form) ---
		return json({
			response_action: 'update',
			view: {
				type: 'modal',
				title: { type: 'plain_text', text: 'Event Created! 🎉' },
				close: { type: 'plain_text', text: 'Close' },
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: `*${title}* has been saved and announced in the channel.`
						}
					}
				]
			}
		});
	}

	return new Response('see payload', { status: 200 });
};
