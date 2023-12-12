import type { Event, Group } from '$types';
import { CRON_SECRET, CAL } from '$env/static/private';
import type { ServerLoad } from '@sveltejs/kit';
import { GroupModel } from '$lib/db/'

export const GET: ServerLoad = async ({ request }) => {
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
		calID: string;
	}

	/*
		This is the default calendar for the one off turn this into a pvt key
	 545d217a064ce6f846e820045fccdaae17db65ee1b53dc14ea249833b94d0f70@group.calendar.google.com
	*/

	const calList: Group[] = await GroupModel.find({})
	const calObj = calList.map((e: Group): CalIDGroups =>
	({
		group: e.group,
		calID: e.calID
	})

	);

	const makeAPICall = (cals: CalIDGroups[]) => {
		const start = new Date();
		const end = new Date();
		// This is the amount of days from today for API
		const days = 30;
		end.setTime(end.getTime() + days * 86400000);

		const promisesArray = cals.map(async (cal: CalIDGroups) => {
			const data = await (
				await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${cal.calID
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

	const eventsFromAPI = await makeAPICall(calObj);

	// writeFileSync('static/data/events.json', JSON.stringify(eventsFromAPI, null, 2), 'utf-8');

	return new Response(JSON.stringify(eventsFromAPI), { status: 200 });
};
