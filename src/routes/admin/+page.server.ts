import { SessionModel } from '$lib/db/sessions';
import UserModel from '$lib/db/users';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const browserSes = cookies.get('session');
	const dbSes = await SessionModel.findOne({ id: browserSes });

	if (browserSes === dbSes?.id && dbSes) {
		const user = await UserModel.findById(dbSes?.user);
		if (Number(dbSes?.expire) >= Date.now() + 1000 * 60 * 60 * 24 * 30) {
			await SessionModel.deleteOne({ id: browserSes });
			cookies.delete('session');
		} else {
			throw redirect(302, `/admin/${user?.role}`);
		}
	} else {
		cookies.delete('session');
		return { success: false }; // wrong password or email
	}
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const role = formData.get('role') as string;

		const userpw = await UserModel.findOne({ email, role }).select(['password', '_id', 'role']);
		if (userpw?.password) {
			const checkpw = await bcrypt.compare(password, userpw.password);

			if (checkpw) {
				const sessionId = randomBytes(32).toString('hex');
				const expire = 1000 * 60 * 60 * 24 * 30; // 30 days

				const session = await (
					await SessionModel.create({
						id: sessionId,
						expire: Date.now() + expire,
						user: userpw._id.toString()
					})
				).save();

				cookies.set('session', session.id, {
					path: `/admin`,
					maxAge: expire
				});
				throw redirect(302, `/admin/${userpw.role}`); // correct password and email
			}
		}
		setTimeout(() => {}, 1000); // Prolongs bruteforce attacks
		return { success: false }; // wrong password or email
	}
};
