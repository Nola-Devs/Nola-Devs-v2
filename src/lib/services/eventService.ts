import EventModel from '$lib/db/events';
import type { Event } from '$lib/types/event.d.ts';

/**
 * @param
 */
export const eventService = {
	getEvents: async () => {
		const events = (await EventModel.find({})
			.sort({ dateTime: 'asc' })
			.select(['-_id', '-__v'])
			.lean()
			.limit(4)) as unknown as Event[];
		return { events };
	},

	getEventsByGroup: async (slug: String): Promise<Event[]> => {
		const events: Event[] | null = await EventModel.find({ groupSlug: slug })
			.select('-_id -__v')
			.lean();

		if (!events) {
			throw new Error('events not found');
		}

		return events;
	},

	getEventsByEventSlug: async (params) => {
		const { eventSlug } = params;
		const event: Event | null = await EventModel.findOne({ eventSlug }).select('-_id -__v').lean();

		if (!event) {
			throw new Error('Event not found');
		}

		// Perform any additional data transformations or fetches here
		return { event };
	}
};
