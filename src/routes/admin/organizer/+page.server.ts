import GroupModel from '$lib/db/models/groups.model';
import SessionModel from '$lib/db/models/sessions.model';
import UserModel from '$lib/db/models/users.model';
import type { Group } from '$lib/types/group.d.ts';
import type { User } from '$lib/types/user.d.ts';

import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Auth
	const browserSes = cookies.get('session');
	const dbSes = await SessionModel.findOne({ id: browserSes }).select(['expire', 'user', 'id']);

	if (dbSes?.id === browserSes && dbSes) {
		const user = (await (
			await UserModel.findById(dbSes?.user).select([
				'-_id',
				'name',
				'pfp',
				'links',
				'email',
				'group'
			])
		)?.toObject()) as User;

		const userGroup = (await (
			await GroupModel.findOne({ group: user?.group }).select([
				'-_id',
				'group',
				'about',
				'calID',
				'orgLinks'
			])
		)?.toObject()) as Group;

		if (!userGroup) {
			const groups = (await GroupModel.distinct('group')) as string[];
			return { user, groups };
		} else {
			return { user, userGroup };
		}
	} else {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session');
		throw redirect(302, '/');
	},
	resetPassword: async ({ cookies }) => {
		cookies.get('sessionId');
	},
	editUser: async ({ request, cookies }) => {
		const userID = await SessionModel.findOne({ id: cookies.get('session') }).select([
			'-_id',
			'user'
		]);

		const formData = (await request.formData()).entries();
		const links: { [key: string]: string } = {};
		for (const pair of formData) {
			if (pair[0].match(/link/) && pair[1]) {
				const host: string = new URL(String(pair[1])).hostname.split('.')[0] as string;
				links[host] = pair[1] as string;
			} else {
				await UserModel.findByIdAndUpdate(userID?.user, { [pair[0]]: pair[1] });
			}
		}

		if (links) {
			await UserModel.findByIdAndUpdate(userID?.user, { links });
		}
	}
};
