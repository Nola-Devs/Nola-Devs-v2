import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'super') throw error(403, 'Super admin only');
	const result = await rsvpController.finalizeExpiredEvents();
	return json(result);
};
