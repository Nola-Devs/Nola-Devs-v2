import { UserModel } from '$lib/db/users';
import type { Actions } from './$types';
import bcrypt from 'bcrypt'
import type Cookies from '@sveltejs/kit';



export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData()
    const email = await formData.get('email') as string
    const password = await formData.get('password') as string
    const permission = await formData.get('permissions') as string

    const userpw = await UserModel
      .findOne({ email, role: permission })
      .select(['password', '-_id'])

    if (userpw?.password) {
      const checkpw = await bcrypt.compare(password, userpw?.password)
      console.log(checkpw)
      // set cookies here
      // TODO: create a session table that stores sessions
      // cookies.set('sid', sid, { 1000 * 60 * 60 * 24 * 30 }) // 30 days
      return { success: true }  // correct password and email
    } else {
      setTimeout(() => { }, 1000)
      return { success: false }  // wrong password or email
    }
  }
};