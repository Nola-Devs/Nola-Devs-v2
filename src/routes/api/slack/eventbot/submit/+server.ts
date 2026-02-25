import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
import { LocationModel } from '$lib/scripts/addLocations';
import {
	createGroupOptions,
	buildCreateEventModalBlocks,
	createLocationOptions
} from '$lib/utils/eventbot';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { Group } from '$lib/types/group';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	console.log('submit endpoint reached');
	const formData = await request.formData();
	const payloadString = formData.get('payload') as string;

	if (!payloadString) {
		return json({ error: 'No payload found' }, { status: 400 });
	}

	const payload = JSON.parse(payloadString);

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
	// const metadata = JSON.parse(payload.view.private_metadata || {}); // private_metadata set in /init endpoint

	console.log('Payload type:', payload.type);
	if (payload.type === 'block_actions') {
		const action = payload.actions[0];
		console.log('action.action_id', action.action_id);

		if (action.action_id === 'create_event') {
			const groups: Group[] = await GroupModel.find({}, 'group slug');
			const groupOptions = createGroupOptions(groups);
			const locations = await LocationModel.find({});
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

	if (payload.type === 'view_submission') {
		// finalize the event and save it to the database
	}

	// TODO: send confirmation message with all event details
	// try {
	// 	await slackClient.chat.postMessage({
	// 		channel: metadata.channel_id,
	// 		text: 'Event created!'
	// 	});
	// 	console.log('Message posted!');
	// } catch (error) {
	// 	console.log(error);
	// }

	return new Response('see payload', { status: 200 });
};
