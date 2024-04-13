import EventModel from '$lib/db/events';
import GroupModel from '$lib/db/groups';
import type { Group } from '$lib/types/group';
import type { Event } from '$lib/types/event.d.ts';
import type { PageServerLoad } from './$types';
import { groupService } from '$lib/services/groupService';

export const load: PageServerLoad = async ({ params }) => {
	 return groupService.getEventsByGroup(params);
};
