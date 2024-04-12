import EventModel from '$lib/db/events';
import type { PageServerLoad } from './$types';
import type { Event } from '$lib/types/event.d.ts';
import { eventService } from '$lib/services/eventService';

export const load: PageServerLoad = async ({ params }) => {
	//const { eventSlug } = params;

	try{

		return new eventService().getEventsByEventSlug(params)

	} catch (error) {
		console.error('Failed to fetch event:', error);
		return {
			status: 404,
			error: new Error('Event not found')
		};
	}
};
