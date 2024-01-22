import type { PageServerLoad } from './$types';
import { GroupModel } from '$lib/db/groups';
import EventModel from '$lib/db/events';
import type { Event } from '$types';

export const load: PageServerLoad = async () => {
	//const events = await GroupModel.distinct('events');
	const events = (await EventModel.find({})
		.select(['-_id', '-__v'])
		.lean()
		.limit(3)
	) as Event[]

	const removeHN: Event[] = events.filter((event: any) => event.summary !== 'Hack Night ')
		.sort(
			(a: Event, b: Event) => new Date(a.start.date).getTime() - new Date(b.start.date).getTime()
		) as Event[];

	return {
		events: removeHN
	};
};
