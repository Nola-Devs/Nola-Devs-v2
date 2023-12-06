import type { PageServerLoad } from './$types';
import type { Group } from '../../app';

import { readFileSync } from 'fs'

export const load: PageServerLoad = async ({ params }) => {
	let groupName = params.group.split('=')[1];
	let group = JSON.parse(await readFileSync('static/data/groups.json', 'utf-8')).find((group: Group) => group.group === groupName);
	let events = JSON.parse(await readFileSync('static/data/events.json', 'utf-8')).find((group: Group) => group.group === groupName);
	return {
		group,
		events
	};
};
