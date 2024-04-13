import type { PageServerLoad } from './$types';
import EventModel from '$lib/db/events';
import type { Event } from '$lib/types/event.d.ts';
import { eventService } from '$lib/services/eventService';

export const load: PageServerLoad = async () => {
	return eventService.getEvents();
};
