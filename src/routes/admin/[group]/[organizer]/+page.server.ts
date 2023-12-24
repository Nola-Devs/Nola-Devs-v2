import { GroupModel } from '$lib/db/groups';
import type { PageServerLoad } from './$types';
import type { Group } from '$types';

export const load: PageServerLoad = async ({ params }) => {

	const organizer = params.organizer;

	return {
		organizer
	};
};
