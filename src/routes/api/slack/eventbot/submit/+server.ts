import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import {
	CANCEL_EVENT_CALLBACK_ID,
	CREATE_EVENT_CALLBACK_ID,
	handleBlockAction,
	type EventbotMetadata
} from '$lib/utils/eventbot/modals';
import {
	handleCancelEventSubmission,
	handleCreateEventSubmission
} from '$lib/utils/eventbot/submissions';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

/**
 * Every button click and modal submission from the `/event` menu arrives here.
 * This endpoint only parses the payload and routes it — the handlers live in
 * `$lib/utils/eventbot/modals` and `$lib/utils/eventbot/submissions`.
 */
export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const formData = await request.formData();
	const payloadString = formData.get('payload') as string;

	if (!payloadString) {
		return json({ error: 'No payload found' }, { status: 400 });
	}

	const payload = JSON.parse(payloadString);

	let metadata: EventbotMetadata;
	try {
		metadata =
			typeof payload.view.private_metadata === 'string'
				? JSON.parse(payload.view.private_metadata)
				: payload.view.private_metadata;
	} catch (err) {
		console.error('Metadata parse error:', err);
		return new Response('', { status: 200 });
	}

	if (payload.type === 'block_actions') {
		await handleBlockAction({
			slackClient,
			payload,
			action: payload.actions[0],
			metadata
		});

		return new Response('', { status: 200 });
	}

	if (payload.type === 'view_submission') {
		const context = { slackClient, payload, metadata };

		if (payload.view.callback_id === CREATE_EVENT_CALLBACK_ID) {
			return handleCreateEventSubmission(context);
		}

		if (payload.view.callback_id === CANCEL_EVENT_CALLBACK_ID) {
			return handleCancelEventSubmission(context);
		}
	}

	return new Response('see payload', { status: 200 });
};
