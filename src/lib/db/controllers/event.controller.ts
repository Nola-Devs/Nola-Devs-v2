import EventModel from '$lib/db/models/events.model';
import type { Event } from '$lib/types/event.d.ts';
import { error } from '@sveltejs/kit';

export const eventController = {

	/**
	 * @async
	 * @returns {Promise<Event[]>} (fulfilled promise) An array of all events.
	 * @throws {error} 404 if no events are found.
	 */
	getEvents: async (): Promise<Event[]> => {
		try {
			const events: Event[] = await EventModel.find({})
				.sort({ start: 'asc' })
				.select(['-_id', '-__v'])
				.lean()
				.limit(10);
			return events;
		} catch (e) {
			throw error(404, 'No Events Found');
		}
	},

	/**
	 * Get all events associated with a particular group.
	 * @async
	 * @param {string} slug The slug of the group to get events for. See `src/lib/scripts/data/groups.json` for slugs.
	 * @returns {Promise<Event[]>} (fulfilled promise) An array of events associated with the group.
	 * @throws {error} 404 if events are not found / group does not exist.
	 * @example eventController.getEventsByGroup('Frontend-Party')
	 */
	getEventsByGroup: async (slug: string): Promise<Event[]> => {
		const events: Event[] = await EventModel.find({ groupSlug: slug }).select('-_id -__v').lean();

		if (!events) {
			throw error(404, 'Group Not Found');
		}

		return events;
	},

	/**
	 * Get all events with a specific `eventSlug`.
	 * @async
	 * @param {string} eventSlug The slug of the desired event. See `src/lib/scripts/data/events.json` for slugs.
	 * @returns {Promise<Event>} (fulfilled promise) The event matching the `eventSlug`.
	 * @throws {error} 404 if event is not found.
	 * @example eventController.getEventsByEventSlug('front-end-party-byobug-09102024')
	 */
	getEventsByEventSlug: async (eventSlug: string): Promise<Event> => {
		try {
			const event: Event | null = await EventModel.findOne({ eventSlug })
				.select('-_id -__v')
				.lean();

			if (!event) {
				throw new Error('Event Not found');
			}

			return event;
		} catch (e) {
			throw error(404, 'Event Not Found');
		}
	}
};