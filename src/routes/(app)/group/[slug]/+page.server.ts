import EventModel from '$lib/db/events';
import GroupModel from '$lib/db/groups';
import type { Group } from '$lib/types/group';
import type { Event } from '$lib/types/event.d.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	try {
		const group: Group | null = await GroupModel.findOne({ slug }).select('-_id -__v').lean();
		if (!group) {
			throw new Error('Group not found');
		}

		// Fetch related events using the group's slug
		const events: Event[]  = await EventModel.find({ groupSlug: slug }).select('-_id -__v').lean();

		return { group, events };
	} catch (error) {
		console.error('Failed to fetch group and events:', error);
		return {
			status: 404,
			error: new Error('Group or events not found')
		};
	}
};
