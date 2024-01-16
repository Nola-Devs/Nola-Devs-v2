import { SessionModel } from '$lib/db/sessions';
import { UserModel } from '$lib/db/users';
import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';


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
	const users = await UserModel.find({}).select(['-_id', '-__v', '-password']).lean()
	return { users }
};

export const actions: Actions = {
	addUser: async ({ request }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const role = formData.get('role') as string

		const hashPW = await bcrypt.hash(password, 12)

		await UserModel.create({ email, password: hashPW, role })

	},
	removeUser: async ({ request }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string

		await UserModel.deleteOne({ email })

	},
	editUser: async ({ request }) => {
		const formData = await request.formData()

		const email = formData.get('email') as string
		const name = formData.get('name') as string
		const role = formData.get('role') as string
		console.log(name)

		const test = await UserModel.findOneAndUpdate({ email }, { name, role })
		console.log(test)
		return { success: true }
	}

}