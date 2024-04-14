import type { PageServerLoad } from './$types';
import type { Event } from '$lib/types/event.d.ts';

export const load: PageServerLoad = async () => {
	const events = (await EventModel.find({})
		.sort({ dateTime: 'asc' })
		.select(['-_id', '-__v'])
		.lean()
		.limit(4)) as unknown as Event[];

	return { events };
	try {
		const events: Event[] = await eventController.getEvents();

		return {
			events
		};
	} catch {
		throw error(404, 'Group Not Found');
	}
};
