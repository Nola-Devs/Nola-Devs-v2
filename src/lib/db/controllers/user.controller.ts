import UserModel from '../models/users.model';
import type { User } from '$lib/types/user';
import { error } from '@sveltejs/kit';

export const userController = {

	/**
	 * Get all users associated with a specific group.
	 * @async
	 * @param {string} group Group name. See `src/lib/scripts/data/events.json` for group names.
	 * @returns {Promise<User[]>} (fulfilled promise) Array of users associated with the group.
	 * @throws {error} 404 if operation fails.
	 * @example userController.getAllUsersByGroup('Hacknight')
	 */
	getAllUsersByGroup: async (group: string): Promise<User[]> => {
		try {
			const users: User[] = await UserModel.find({ group })
				.select(['-_id', '-__v', '-role'])
				.lean();
			return users;
		} catch (e) {
			throw error(404, 'Error looking up organizers');
		}
	},

	/**
	 * Get all organizers from all groups.
	 * @async
	 * @returns {Promise<User[]>} (fulfilled promise) Array of all organizers.
	 * @throws {error} 404 if operation fails.
	 * @example userContoller.getAllOrganizers()
	 */
	getAllOrganizers: async (): Promise<User[]> => {
		try {
			const users: User[] = await UserModel.find({ group: { $ne: null } })
				.select(['-_id', '-__v', '-role'])
				.lean();

			return users;
		} catch (e) {
			throw error(404, 'Error looking up organizers');
		}
	}
};
