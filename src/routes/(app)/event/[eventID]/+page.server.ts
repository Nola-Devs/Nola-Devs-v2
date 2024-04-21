import type { PageServerLoad } from './$types';
import { eventController } from '$lib/db/controllers/event.controller';
import { groupController } from '$lib/db/controllers/group.controller';
import { error } from '@sveltejs/kit';
import { userController } from '$lib/db/controllers/user.controller';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { eventID } = params;
		const event = await eventController.getEventsByEventSlug(eventID);
		const group = await groupController.getGroupByName(event.group);
		const users = await userController.getAllUsersByGroup(group?.group);
		console.log(event);
		return {
			event,
			group,
			users
		};
	} catch {
		throw error(404, 'Event Not Found');
	}
};
