import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';
import { rateLimit } from '$lib/server/rate-limit';

const RSVP_LIMIT = 10;
const RSVP_WINDOW_MS = 60_000;

export const POST: RequestHandler = async ({ params, request, getClientAddress }) => {
	const ip = getClientAddress();
	if (!rateLimit(`rsvp:${ip}`, RSVP_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many RSVPs from this address. Try again in a minute.');
	}

	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid JSON');

	const { editToken, updated } = await rsvpController.upsert(params.eventID, body);
	return json({ editToken, updated });
};
