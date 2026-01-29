import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { RequestHandler } from '@sveltejs/kit';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const trigger_id = formData.get('trigger_id') as string;
	const channel_id = formData.get('channel_id') as string;
	const user_id = formData.get('user_id') as string;

	if (!trigger_id || !channel_id || !user_id) {
		return new Response('Required data not present. Check trigger_id, channel_id, and user_id.');
	}

	await slackClient.views.open({
		trigger_id: trigger_id,
		view: {
			type: 'modal',
			private_metadata: JSON.stringify({
				channel_id: channel_id,
				user_id: user_id
			}),
			close: {
				type: 'plain_text',
				text: 'Cancel',
				emoji: true
			},
			title: {
				type: 'plain_text',
				text: 'Eventbot',
				emoji: true
			},
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: 'List and manage events on noladevs.org!'
					}
				},
				{
					type: 'divider'
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: ':calendar:  *Create an upcoming event*'
					},
					accessory: {
						type: 'button',
						action_id: 'create_event',
						text: {
							type: 'plain_text',
							text: 'Create',
							emoji: true
						},
						style: 'primary',
						value: 'create_event'
					}
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: ':pencil2:  *Edit an upcoming event*'
					},
					accessory: {
						type: 'button',
						action_id: 'edit_event',
						text: {
							type: 'plain_text',
							text: 'Edit',
							emoji: true
						},
						value: 'edit_event'
					}
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: ':x:  *Cancel an upcoming event*'
					},
					accessory: {
						type: 'button',
						action_id: 'cancel_	event',
						text: {
							type: 'plain_text',
							text: 'Cancel',
							emoji: true
						},
						style: 'danger',
						value: 'cancel_event'
					}
				}
			]
		}
	});

	// respond with opening modal and 200 success response
	return new Response(`Please submit your event through the form`, { status: 200 });
};
