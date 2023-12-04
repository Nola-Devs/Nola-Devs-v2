import type { PageServerLoad } from './$types';
import type { Group } from '../../app';
import GROUP_OBJ from '/static/data/groups';
import EVENTS_OBJ from '/static/data/events';

export const load: PageServerLoad = async ({ params }) => {
	let groupName = params.group.split('=')[1];
	let group = GROUP_OBJ.find((group: Group) => group.group === groupName);
	let events = EVENTS_OBJ.find((group: Group) => group.group === groupName);
	return {
		group,
		events
	};
};
