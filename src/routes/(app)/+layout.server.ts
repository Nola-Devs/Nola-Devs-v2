import GroupModel from '$lib/db/models/groups.model';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const groupsData = await GroupModel.find({}, 'group slug icon -_id').lean();

	const groups = groupsData.map(({ group, slug, icon }) => ({
		name: group,
		slug,
		icon
	}));

	return { groups };
};
