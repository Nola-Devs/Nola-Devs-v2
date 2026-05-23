import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';
import { rateLimit } from '$lib/server/rate-limit';

const RSVP_IP_LIMIT = 20;
const RSVP_TOKEN_LIMIT = 10;
const RSVP_WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 4096;

function gate(ip: string, token: string): void {
	if (!rateLimit(`rsvp:edit:ip:${ip}`, RSVP_IP_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many requests');
	}
	// Per-token cap throttles brute-forcing of a specific token.
	if (!rateLimit(`rsvp:edit:token:${token}`, RSVP_TOKEN_LIMIT, RSVP_WINDOW_MS)) {
		throw error(429, 'Too many requests');
	}
}

export const PATCH: RequestHandler = async ({ params, request, getClientAddress }) => {
	gate(getClientAddress(), params.token);
	const len = Number(request.headers.get('content-length') ?? 0);
	if (len > MAX_BODY_BYTES) throw error(413, 'Payload too large');
	const body = await request.json().catch(() => null);
	if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');
	await rsvpController.updateByToken(params.eventID, params.token, body);
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params, getClientAddress }) => {
	gate(getClientAddress(), params.token);
	await rsvpController.deleteByToken(params.eventID, params.token);
	return json({ ok: true });
};
