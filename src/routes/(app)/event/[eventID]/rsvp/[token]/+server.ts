import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';
import { rateLimit } from '$lib/server/rate-limit';

const RSVP_LIMIT = 10;
const RSVP_WINDOW_MS = 60_000;

export const PATCH: RequestHandler = async ({ params, request, getClientAddress }) => {
	const ip = getClientAddress();
	if (!rateLimit(`rsvp:${ip}`, RSVP_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many requests');
	}
	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid JSON');
	await rsvpController.updateByToken(params.eventID, params.token, body);
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params, getClientAddress }) => {
	const ip = getClientAddress();
	if (!rateLimit(`rsvp:${ip}`, RSVP_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many requests');
	}
	await rsvpController.deleteByToken(params.eventID, params.token);
	return json({ ok: true });
};
