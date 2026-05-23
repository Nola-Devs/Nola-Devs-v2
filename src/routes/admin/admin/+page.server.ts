import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import UserModel from '$lib/db/models/users.model';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin');
	if (locals.user.role !== 'super') throw error(403, 'Super admin only');

	const users = await UserModel.find({ githubId: { $exists: true } })
		.select(['name', 'email', 'role', 'avatarUrl', 'groupIds'])
		.lean<
			{
				_id: { toString(): string };
				name?: string;
				email: string;
				role: string;
				avatarUrl?: string;
				groupIds?: { toString(): string }[];
			}[]
		>();

	return {
		users: users.map((u) => ({
			id: u._id.toString(),
			name: u.name,
			email: u.email,
			role: u.role,
			avatarUrl: u.avatarUrl,
			groupIds: (u.groupIds ?? []).map((g) => g.toString())
		}))
	};
};
