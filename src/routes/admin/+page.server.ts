import { SessionModel } from '$lib/db/sessions';
import { UserModel } from '$lib/db/users';
import type { Actions } from './$types';
import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto';



export const actions: Actions = {
  login: async ({ request, cookies }) => {

    const formData = await request.formData()
    const email = await formData.get('email') as string
    const password = await formData.get('password') as string
    const permission = await formData.get('permissions') as string

    const userpw = await UserModel
      .findOne({ email, role: permission })
      .select(['password', '_id'])

    if (userpw?.password) {

      const checkpw = await bcrypt.compare(password, userpw.password)

      if (checkpw) {

        const sessionId = randomBytes(32).toString('hex')
        const expire = 1000 * 60 * 60 * 24 * 30; // 30 days

        (await SessionModel.create({
          id: sessionId,
          expire: Date.now() + expire,
          user: userpw._id.toString()
        })).save()

        cookies.set('session', sessionId, {
          path: '/admin',
          maxAge: expire
        })

        return { success: true }  // correct password and email
      }
    }
    setTimeout(() => { }, 1000) // Prolongs bruteforce attacks
    return { success: false }  // wrong password or email
  }
};