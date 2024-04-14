import type { PageServerLoad } from './$types';
import { eventController } from '$lib/db/controllers/event.controller';
import { groupController } from '$lib/db/controllers/group.controller';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { eventID } = params;
		const event = await eventController.getEventsByEventSlug(eventID);
		const group = await groupController.getGroup(event.group);

		return {
			event,
			group
		};
	} catch {
		throw error(404, 'Event Not Found');
	}
};
