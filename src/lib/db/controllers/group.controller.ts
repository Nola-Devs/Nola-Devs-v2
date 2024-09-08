import GroupModel from '$lib/db/models/groups.model';
import type { Group } from '$lib/types/group';
import { error } from '@sveltejs/kit';

export const groupController = {
	/**
	 * Get group object by the group's name.
	 * @async
	 * @param {string} groupName See `src/lib/scripts/data/groups.json` for group names.
	 * @returns {Promise<Group>} (fulfilled promise) A group matching the `groupName`.
	 * @throws {error} 404 if group not found.
	 * @example groupController.getGroupByName('Below C Level')
	 */
	getGroupByName: async (groupName: string): Promise<Group> => {
		try {
			const group: Group = await GroupModel.findOne({ group: groupName })
				.select('-_id -__v')
				.lean();

			return group;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	},

	/**
	 * Get group object by the group's slug.
	 * @async
	 * @param {string} slug Slug of desired group. See `src/lib/scripts/data/groups.json` for slugs.
	 * @returns {Promise<Group>} (fulfilled promise) A group with a slug matching `slug`.
	 * @throws {error} 404 if group not found.
	 * @example groupController.getGroupBySlug('Below-C-Level')
	 */
	getGroupBySlug: async (slug: string): Promise<Group> => {
		try {
			const group: Group = await GroupModel.findOne({ slug }).select('-_id -__v').lean();

			return group;
		} catch (e) {
			throw error(404, 'Group Not Found');
		}
	}
};
