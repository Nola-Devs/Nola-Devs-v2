import type { Event } from '../../../app.js';
import { CRON_SECRET, CAL } from '$env/static/private';
import { writeFileSync, readFileSync } from 'fs';
export const GET = async ({ request }) => {
	// auth
	const authHeader = request.headers.get('authorization');
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('', { status: 401 });
	}

	interface EventsGroups {
		group: string;
		events: Event[];
	}
	interface CalIDGroups {
		group: string;
		calID: Event[];
	}

	const calList = JSON.parse(await readFileSync('static/data/groups.json', 'utf-8')).map(
		(e: CalIDGroups): CalIDGroups => ({
			group: e.group,
			calID: e.calID
		})
	);

	const makeAPICall = (cals: EventsGroups) => {
		const start = new Date();
		const end = new Date();
		// This is the amount of days from today for API
		const days = 30;
		end.setTime(end.getTime() + days * 86400000);

		const promisesArray = calList.map(async (cal: CalIDGroups) => {
			const data = await (
				await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${
						cal.calID
					}/events?timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&singleEvents=true&showDeleted=false&orderBy=startTime&key=${CAL}`,
					{ method: 'GET' }
				)
			).json();
			// TODO: Add a geocoding Key here in the events OBJ for less API calls on run time
			const events: Event[] = data.items.map((e: any) => ({
				summary: e.summary,
				calLink: e.htmlLink,
				description: e.description,
				location: e.location,
				start: {
					date: e.start?.dateTime
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
					time: e.start?.dateTime
						? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
								new Date(e.start.dateTime)
						  )
						: undefined
				},
				end: {
					date: e.start?.dateTime
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
					time: e.start?.dateTime
						? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
								new Date(e.end.dateTime)
						  )
						: undefined
				}
			})) as Event[];

			return {
				group: cal.group,
				events: events
			} as EventsGroups;
		});
		return Promise.all(promisesArray);
	};

	const eventsFromAPI = await makeAPICall(calList);

	writeFileSync('static/data/events.json', JSON.stringify(eventsFromAPI, null, 2), 'utf-8');

	return new Response(JSON.stringify(eventsFromAPI), { status: 200 });
};
