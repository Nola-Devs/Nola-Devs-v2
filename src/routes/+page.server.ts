import type { PageServerLoad } from './$types';
import EVENTS_OBJ from '/static/data/events';

export const load: PageServerLoad = async ({ params }) => {
	let events = EVENTS_OBJ.flatMap((obj: { events: any }) => obj.events);
	return {
		events
	};
};
