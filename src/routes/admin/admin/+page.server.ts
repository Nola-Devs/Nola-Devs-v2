import { SessionModel } from '$lib/db/sessions';
import { UserModel } from '$lib/db/users';
import { redirect } from '@sveltejs/kit';


export const load = async ({ cookies }) => {
	const browserSes = cookies.get('session');
	const dbSes = await SessionModel.findOne({ id: browserSes });
	const user = await UserModel.findById(dbSes?.user);
	console.log('test')

	if (Number(dbSes?.expire) > Date.now() + 1000 * 60 * 60 * 24 * 30) {
		await SessionModel.deleteOne({ id: browserSes });
	}

	if (dbSes?.id !== browserSes || !browserSes || user?.role !== 'admin') {
		throw redirect(302, `/admin`);
	}

};