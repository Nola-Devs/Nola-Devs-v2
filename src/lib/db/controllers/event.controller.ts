import EventModel from '$lib/db/models/events.model';
import type { Event } from '$lib/types/event.d.ts';
import { error } from '@sveltejs/kit';

/**
 * @param
 */
export const eventController = {
	getEvents: async (): Promise<Event[]> => {
		try {
			const events: Event[] = await EventModel.find({})
				.sort({ dateTime: 'asc' })
				.select(['-_id', '-__v'])
				.lean()
				.limit(10);
			return events;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	},

	getEventsByGroup: async (slug: string): Promise<Event[]> => {
		const events: Event[] = await EventModel.find({ groupSlug: slug }).select('-_id -__v').lean();

		if (!events) {
			throw error(404, 'Group Not Found');
		}

		return events;
	},

	getEventsByEventSlug: async (eventSlug: string) => {
		try {
			const event: Event | null = await EventModel.findOne({ eventSlug })
				.select('-_id -__v')
				.lean();

			if (!event) {
				throw new Error('Event not found');
			}

			return event;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	}
};
