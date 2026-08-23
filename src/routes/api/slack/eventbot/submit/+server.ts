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
import { postErrorReport } from '$lib/utils/eventbot/audit';
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

	// only interactions inside a modal carry metadata. a button on a posted message
	// has no view at all, which is not a parse failure and should not look like one
	const privateMetadata = payload.view?.private_metadata;

	let metadata: EventbotMetadata = {};
	if (typeof privateMetadata === 'string') {
		try {
			metadata = JSON.parse(privateMetadata);
		} catch (err) {
			console.error('Metadata parse error:', err);
		}
	} else if (privateMetadata) {
		metadata = privateMetadata;
	}

	if (payload.type === 'block_actions') {
		const action = payload.actions?.[0];

		try {
			await handleBlockAction({ slackClient, payload, action, metadata });
		} catch (err) {
			// slack shows the user nothing when a block action fails, so the audit
			// channel is the only place this surfaces
			console.error('Block action failed:', err);

			await postErrorReport(slackClient, {
				action: `handle the ${action?.action_id ?? 'unknown'} action`,
				userId: payload.user?.id ?? metadata.user_id,
				error: err
			});
		}

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

	// anything else is an interaction the bot does not handle. slack only needs a
	// 200 to stop retrying, and shows the user whatever body comes back
	console.warn(`Unhandled eventbot interaction: ${payload.type}`);

	return new Response('', { status: 200 });
};
