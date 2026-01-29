import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
import { createGroupOptions, buildCreateEventModalBlocks } from '$lib/utils/eventbot';
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
	const metadata = JSON.parse(payload.view.private_metadata || {}); // private_metadata set in /init endpoint

	console.log('Payload type:', payload.type);
	if (payload.type === 'block_actions') {
		const action = payload.actions[0];

		if (action.action_id === 'create_event') {
			const groups: Group[] = await GroupModel.find({}, 'group slug');
			const groupOptions = createGroupOptions(groups);

			const updatedMetadata = {
				...metadata,
				groups
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
					blocks: [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: 'Add event details below'
							}
						},
						{
							type: 'divider'
						},
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: 'Group'
							},
							accessory: {
								type: 'static_select',
								action_id: 'group_select',
								placeholder: {
									type: 'plain_text',
									text: 'Choose list',
									emoji: true
								},
								options: [
									...groupOptions,
									{
										text: {
											type: 'plain_text',
											text: 'Other Group',
											emoji: true
										},
										value: 'other-group'
									}
								]
							}
						}
					]
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
