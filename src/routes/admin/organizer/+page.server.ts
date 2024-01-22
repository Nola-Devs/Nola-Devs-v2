import { SessionModel } from '$lib/db/sessions';
import { UserModel } from '$lib/db/users';
import { GroupModel } from '$lib/db/groups.js';

import { redirect, type Actions } from '@sveltejs/kit';


export const load = async ({ cookies }) => {
  // Auth
  const browserSes = cookies.get('session');
  const dbSes = await SessionModel.findOne({ id: browserSes }).select(['expire', 'user', 'id']);

  if (dbSes?.id === browserSes && dbSes) {
    const user = (await UserModel
      .findById(dbSes?.user)
      .select([
        '-_id',
        'name',
        'pfp',
        'links',
        'email',
        'group'
      ]))?.toObject()

    const userGroup = (await GroupModel
      .findOne({ group: user?.group })
      .select([
        '-_id',
        'group',
        'about',
        'calID',
        'orgLinks',
      ]))?.toObject()

    return {
      user,
      userGroup
    }
  }
}


export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('session');
    throw redirect(302, '/');
    return { success: true };
  },
  editUser: async ({ request, cookies }) => {
    const formData = (await request.formData()).entries()
    const userID = await SessionModel.findOne({ id: cookies.get('session') }).select(['-_id', 'user'])

    for (const pair of formData) {
      if (pair[1]) {
        await UserModel.findByIdAndUpdate(userID?.user, { [pair[0]]: pair[1] })
      }
    }

  }
}