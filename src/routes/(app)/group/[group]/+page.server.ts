import type { PageServerLoad } from './$types';
import { groupController } from '$lib/db/controllers/group.controller';
import { eventController } from '$lib/db/controllers/event.controller';
import { error } from '@sveltejs/kit';
import { userController } from '$lib/db/controllers/user.controller';
import type { Event } from '$lib/types/event';
import type { Group } from '$lib/types/group';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const slug = params.group;

		const events: Event[] = await eventController.getEventsByGroup(slug);
		const group: Group = await groupController.getGroupBySlug(slug);
		const users = await userController.getAllUsersByGroup(group?.group);

		return {
			group,
			events,
			users
		};
	} catch (e) {
		throw error(404, 'Group Not Found');
	}
};
