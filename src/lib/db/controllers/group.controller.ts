import GroupModel from '$lib/db/models/groups.model';
import type { Group } from '$lib/types/group';
import { error } from '@sveltejs/kit';

export const groupController = {
	/**
	 * @param slug Group Slug
	 * @returns a Group
	 */
	getGroup: async (slug: string): Promise<Group> => {
		try {
			const group: Group = await GroupModel.findOne({ slug }).select('-_id -__v').lean();

			return group;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	}

	// Fetch related events via event service using group's slug
	// getEventsByGroup: async (groupSlug: string) => {
	// 	try {
	// 		const group: Group | null = await groupService.getGroup(groupSlug);
	// 		const events: Event[] = await eventService.getEventsByGroup(slug);

	// 		return { group, events };
	// 	} catch (e) {
	// 		console.error('Failed to fetch group and events:', error);
	// 		return {
	// 			status: 404,
	// 			error: new Error('Group or events not found')
	// 		};
	// 	}
	// }
};
