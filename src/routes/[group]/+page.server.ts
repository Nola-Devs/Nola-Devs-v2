import type { PageServerLoad } from './$types';
import type { Event, PageServerLoadResult } from '$appTypes';

import { CAL } from '$env/static/private';
import { findGroupByName, type Group } from '$data';
import { Sanitizer } from '$lib';

export const load: PageServerLoad = async ({ params }): Promise<PageServerLoadResult> => {
	const group: string = (await params.group.split('=')[1]) as string;
	const groupObj: Group = findGroupByName(group) as Group;
	const calID: string = groupObj.calID;

	const start = await new Date();

	const res = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${calID}/events?maxResults=5&timeMin=${start.toISOString()}&singleEvents=true&showDeleted=false&key=${CAL}`,
		{ method: 'GET' }
	);

	const eventsJSON = (await res.json()).items;

	const events: Event[] =
		eventsJSON !== undefined
			? (eventsJSON.map((e: any) => ({
					summary: e.summary,
					calLink: e.htmlLink,
					description: Sanitizer(e.description),
					location: e.location,
					start: {
						date:
							e.start?.dateTime !== undefined
								? new Intl.DateTimeFormat('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
								  }).format(new Date(e.start.dateTime))
								: new Intl.DateTimeFormat('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
								  }).format(new Date(e.start.date)),
						time:
							e.start?.dateTime !== undefined
								? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
										new Date(e.start.dateTime)
								  )
								: undefined
					},
					end: {
						date:
							e.start?.dateTime !== undefined
								? new Intl.DateTimeFormat('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
								  }).format(new Date(e.end.dateTime))
								: new Intl.DateTimeFormat('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
								  }).format(new Date(e.end.date)),
						time:
							e.start?.dateTime !== undefined
								? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
										new Date(e.end.dateTime)
								  )
								: undefined
					}
			  })) as Event[])
			: [];

	return {
		groupObj,
		events
	};
};
