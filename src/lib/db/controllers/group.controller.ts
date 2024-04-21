import GroupModel from '$lib/db/models/groups.model';
import type { Group } from '$lib/types/group';
import { error } from '@sveltejs/kit';

export const groupController = {
	/**
	 * @param slug Group Slug
	 * @returns a Group
	 */
	getGroupByName: async (groupName: string): Promise<Group> => {
		try {
			const group: Group = await GroupModel.findOne({ group: groupName })
				.select('-_id -__v')
				.lean();
			console.log(group);
			return group;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	},
	getGroupBySlug: async (slug: string): Promise<Group> => {
		try {
			const group: Group = await GroupModel.findOne({ slug }).select('-_id -__v').lean();
			console.log(group);
			return group;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	}
};
