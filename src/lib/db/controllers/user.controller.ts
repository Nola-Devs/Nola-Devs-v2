import UserModel from '../models/users.model';
import type { User } from '$lib/types/user';
import { error } from '@sveltejs/kit';

export const userController = {
	getAllUsersByGroup: async (group: string) => {
		try {
			const users: User[] = await UserModel.find({ group })
				.select(['-_id', '-__v', '-role'])
				.lean();
			return users;
		} catch (e) {
			throw error(404, 'Error looking up organizers');
		}
	}
};
