import GroupModel from '$lib/db/groups';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	  const groupsData = await GroupModel.find({}, 'group slug -_id').lean();
  
	  const groups = groupsData.map(({ group, slug }) => ({
		name: group,
		slug: slug
	  }));
	
	  return { groups };
};
