import users from './data/users.json' assert { type: 'json' };
import UserModel from '$lib/db/models/users.model';

export const loadUsers = async () => {
	const res = await UserModel.bulkSave(users.map((e) => new UserModel(e)));
	console.log(res);
};
