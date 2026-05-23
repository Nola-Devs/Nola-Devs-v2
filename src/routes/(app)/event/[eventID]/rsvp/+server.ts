import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';
import { rateLimit } from '$lib/server/rate-limit';

const RSVP_IP_LIMIT = 10;
const RSVP_EVENT_LIMIT = 60;
const RSVP_WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 4096;

export const POST: RequestHandler = async ({ params, request, getClientAddress }) => {
	const ip = getClientAddress();
	if (!rateLimit(`rsvp:ip:${ip}`, RSVP_IP_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many RSVPs from this address. Try again in a minute.');
	}
	// Per-event cap protects a single event from being flooded across many IPs.
	if (!rateLimit(`rsvp:event:${params.eventID}`, RSVP_EVENT_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many RSVPs for this event right now. Try again in a minute.');
	}

	const len = Number(request.headers.get('content-length') ?? 0);
	if (len > MAX_BODY_BYTES) throw error(413, 'Payload too large');

	const body = await request.json().catch(() => null);
	if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');

	const result = await rsvpController.create(params.eventID, body);
	return json(result);
};
