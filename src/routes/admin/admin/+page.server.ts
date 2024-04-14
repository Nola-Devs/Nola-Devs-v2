// import SessionModel from '$lib/db/models/sessions.model';
// import UserModel from '$lib/db/models/users.model';
// import { redirect } from '@sveltejs/kit';

// import bcrypt from 'bcrypt';
// import type { Actions, PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const browserSes = cookies.get('session');
// 	const dbSes = await SessionModel.findOne({ id: browserSes });
// 	const user = await UserModel.findById(dbSes?.user);

// 	if (Number(dbSes?.expire) > Date.now() + 1000 * 60 * 60 * 24 * 30) {
// 		await SessionModel.deleteOne({ id: browserSes });
// 	}

// 	if (dbSes?.id !== browserSes || !browserSes || user?.role !== 'admin') {
// 		throw redirect(302, `/admin`);
// 	}
// 	const users = (await UserModel.find({}).select(['name', 'email', 'role', '-_id'])).map((user) =>
// 		user.toObject()
// 	);

// 	return { users };
// };

// export const actions: Actions = {
// 	addUser: async ({ request }) => {
// 		const formData = await request.formData();
// 		const email = formData.get('email') as string;
// 		const password = formData.get('password') as string;
// 		const role = formData.get('role') as string;

// 		const hashPW = await bcrypt.hash(password, 12);

// 		await UserModel.create({ email, password: hashPW, role });
// 	},
// 	removeUser: async ({ request }) => {
// 		const formData = await request.formData();
// 		const email = formData.get('email') as string;
// 		const name = formData.get('name') as string;
// 		await UserModel.deleteOne({ email, name });
// 	},
// 	editUser: async ({ request }) => {
// 		const formData = await request.formData();

// 		const email = formData.get('email') as string;
// 		const name = formData.get('name') as string;
// 		const role = formData.get('role') as string;
// 		const password = formData.get('password') as string;
// 		// console.log(email);
// 		const user = await UserModel.findOneAndUpdate({ email }, { name, role });

// 		if (password && user) {
// 			const hashPW = await bcrypt.hash(password, 12);
// 			await UserModel.findOneAndUpdate({ email }, { password: hashPW });
// 		}

// 		return { success: true };
// 	}
// };
