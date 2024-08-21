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
				.sort({ start: 'asc' })
				.select(['-_id', '-__v'])
				.lean()
				.limit(10);
			return events;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	},

	/**
	 * @ param {string} slug - The slug of the group to get events for
	 * @ returns {Promise<Event[]>} - An array of events for the group
	 * @ throws {Error} - Throws an error if the group is not found
	 *
	 * Example usage: eventController.getEventsByGroup('slug')
	 **/
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
