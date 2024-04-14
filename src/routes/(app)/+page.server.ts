import type { PageServerLoad } from './$types';
import type { Event } from '$lib/types/event.d.ts';
import { eventController } from '$lib/db/controllers/event.controller';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const events: Event[] = await eventController.getEvents();

		return {
			events
		};
	} catch {
		throw error(404, 'Group Not Found');
	}
};
