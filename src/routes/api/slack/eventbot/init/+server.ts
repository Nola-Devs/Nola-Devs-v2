import { WebClient } from '@slack/web-api';
import { RequestHandler } from '@sveltejs/kit';
import { SLACK_BOT_TOKEN } from '$env/static/private';

const wc = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const trigger_id = formData.get('trigger_id') as string;
	if (!trigger_id) {
		return new Response('trigger_id absent or invalid');
	}

	await wc.views.open({
		trigger_id: trigger_id,
		view: {
			type: 'modal',
			title: { type: 'plain_text', text: 'Create Event' },
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: "It's Block Kit...but _in a modal_"
					},
					block_id: 'section1',
					accessory: {
						type: 'button',
						text: {
							type: 'plain_text',
							text: 'Click me'
						},
						action_id: 'button_abc',
						value: 'Button value',
						style: 'danger'
					}
				},
				{
					type: 'input',
					label: {
						type: 'plain_text',
						text: 'Input label'
					},
					element: {
						type: 'plain_text_input',
						action_id: 'input1',
						placeholder: {
							type: 'plain_text',
							text: 'Type in here'
						},
						multiline: false
					},
					optional: false
				}
			],
			close: {
				type: 'plain_text',
				text: 'Cancel'
			},
			submit: { type: 'plain_text', text: 'Submit' }
		}
	});

	// TODO: handle errors

	// respond with opening modal and 200 success response
	return new Response(`Please submit your event through the form`, { status: 200 });
};
