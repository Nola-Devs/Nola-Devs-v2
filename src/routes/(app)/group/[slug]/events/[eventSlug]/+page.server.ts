import EventModel from '$lib/db/events';
import type { PageServerLoad } from './$types';
import type { Event } from '$lib/types/event.d.ts';

export const load: PageServerLoad = async ({ params }) => {
	const { eventSlug } = params;

	try {
		const event: Event | null = await EventModel.findOne({ eventSlug }).select('-_id -__v').lean();
		if (!event) {
			throw new Error('Event not found');
		}

		// Perform any additional data transformations or fetches here

		return { event };
	} catch (error) {
		console.error('Failed to fetch event:', error);
		return {
			status: 404,
			error: new Error('Event not found')
		};
	}
};
