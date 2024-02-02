import type { PageServerLoad } from './$types';
import EventModel from '$lib/db/events';
import type { Event } from '$types';

export const load: PageServerLoad = async () => {
	const events = (await EventModel.find({}).select(['-_id', '-__v']).lean().limit(3)) as Event[];

	const removeHN: Event[] = events
		.filter((event: Event) => event.summary !== 'Hack Night ')
		.sort(
			(a: Event, b: Event) => new Date(a.start.date).getTime() - new Date(b.start.date).getTime()
		) as Event[];

	return {
		events: removeHN
	};
};
