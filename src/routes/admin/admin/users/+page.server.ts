import type { PageServerLoad } from './$types';
import { UserModel } from "$lib/db/users"
import type { Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async () => {
  const users = await UserModel.find({}).select(['-_id', '-__v', '-password']).lean()
  return { users }
}


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