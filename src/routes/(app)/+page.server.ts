import type { PageServerLoad } from './$types';
import EventModel from '$lib/db/events';
import type { Event } from '$types';

export const load: PageServerLoad = async () => {
	const events = (await EventModel.find({})
		.sort({ dateTime: 'asc' })
		.select(['-_id', '-__v'])
		.lean()
		.limit(4)) as Event[];

	return { events };
};
