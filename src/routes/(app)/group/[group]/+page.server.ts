import { GroupModel } from '$lib/db/groups';
import type { PageServerLoad } from './$types';
import type { Group, Event, User } from '$types';
import EventModel from '$lib/db/events';
import UserModel from '$lib/db/users';



export const load: PageServerLoad = async ({ params }) => {
	const slug = params.group.replace(/-/g, ' ');

	const group = (await GroupModel.findOne({ group: slug })
		.select(['-_id', '-__v'])
		.lean()) as Group;

	const events = (await EventModel.find({ group: slug })
		.select(['-_id', '-__v'])
		.lean()) as Event[];

	const organizers = (await UserModel.find({ group: slug })
		.select(['-_id', '-__v'])
		.lean()) as User[];

	return {
		group,
		events
	};
};
