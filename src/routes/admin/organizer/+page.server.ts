import { SessionModel } from '$lib/db/sessions';
import { UserModel } from '$lib/db/users';
import { GroupModel } from '$lib/db/groups.js';
import { redirect } from '@sveltejs/kit';


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
      ]))?.toObject();

    const userGroup = await GroupModel
      .find({ group: user?.group })
      .select([
        '-_id',
        'group',
        'about',
        'calID',
        'orgLinks',
      ])


    return {
      user,
      userGroup
    }
  }

}
