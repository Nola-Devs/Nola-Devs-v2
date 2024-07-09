import { error } from '@sveltejs/kit';

import { eventController } from '$lib/db/controllers/event.controller';

import type { PageServerLoad } from './$types';
import type { Event } from '$lib/types/event.d.ts';

export const load: PageServerLoad = async () => {
	try {
		const events: Event[] = (await eventController.getEvents()).sort(
			(a, b) => a.start.getTime() - b.start.getTime()
		);

		return {
			events
		};
	} catch {
		throw error(404, 'Group Not Found');
	}
};
