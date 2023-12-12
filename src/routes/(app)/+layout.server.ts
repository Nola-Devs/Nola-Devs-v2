import GroupModel from '$lib/db/groups';
import type { LayoutServerLoad } from './$types';
import type { Group } from '$types';

//import { GROUPS } from '$lib/db/groups';

export const load: LayoutServerLoad = async () => {
	const groups: (string | undefined | null)[] = await GroupModel.distinct('group')
	return {
		groups
	};
};
