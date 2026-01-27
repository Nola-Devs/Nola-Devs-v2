import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	console.log('submit endpoint reached');
	const formData = await request.formData();
	const payloadString = formData.get('payload') as string;

	if (!payloadString) {
		return json({ error: 'No payload found' }, { status: 400 });
	}

	const payload = JSON.parse(payloadString);
	const metadata = JSON.parse(payload.view.private_metadata); // private_metadata set in /init endpoint

	console.log('Payload type:', payload.type);

	try {
		await slackClient.chat.postMessage({
			channel: metadata.channel_id,
			text: 'Event created!'
		});
		console.log('Message posted!');
	} catch (error) {
		console.log(error);
	}

	return new Response('see payload', { status: 200 });
};
