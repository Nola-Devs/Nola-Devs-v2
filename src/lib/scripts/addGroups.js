import groups from './data/groups.ts' assert { type: 'json' };
import GroupModel from '$lib/db/groups';

export const loadGroups = async () => {
	const res = await GroupModel.bulkSave(groups.map((e) => new GroupModel(e)));
	console.log(res);
};
