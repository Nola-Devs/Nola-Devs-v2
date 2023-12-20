import type { PageServerLoad } from './$types';
import { GroupModel } from '$lib/db/groups';
import type { Event } from '$types';

export const load: PageServerLoad = async () => {
	const events = await GroupModel.distinct('events');
	const removeHN = events
		.filter((event) => event.summary !== 'Hack Night ')
		.sort(
			(a: Event, b: Event) => new Date(a.start.date).getTime() - new Date(b.start.date).getTime()
		) as Event[];

	return {
		events: removeHN
	};
};
