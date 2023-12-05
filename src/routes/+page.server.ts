import type { PageServerLoad } from './$types';
import EVENTS_OBJ from '/static/data/events';

export const load: PageServerLoad = async ({ params }) => {
	let events = EVENTS_OBJ
		// This flattens the the objects in the Array
		.flatMap((obj: { group: string; events: any }) =>
			// This removes the hacknight double posted
			obj.events.filter((e: any) => !(e.summary == 'Hack Night ' && obj.group !== 'Hack Night'))
		);

	return {
		events
	};
};
