import type { Group} from '$types';
import { CRON_SECRET } from '$env/static/private';
import { writeFileSync, readFileSync } from 'fs';
import { updateEvents } from '$lib/utils/update-events.js';
import {GroupModel} from '$lib/db'

export const GET = async ({ request }) => {
	// auth
	const authHeader = request.headers.get('authorization');
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('You Shall Not Pass!', { status: 401 });
	}

	interface CalIDGroups {
		group: string;
		calID: string;
	}


	const calList: Group[] = await GroupModel.find({})
	const calObj = calList.map((e: Group): CalIDGroups =>
	({
		group: e.group,
		calID: e.calID
	})
	
	);
	const eventsFromAPI = await updateEvents(calObj);

	writeFileSync('static/data/events.json', JSON.stringify(eventsFromAPI, null, 2), 'utf-8');

	return new Response(JSON.stringify(eventsFromAPI), { status: 200 });
};
