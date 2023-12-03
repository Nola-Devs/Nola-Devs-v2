import type { PageServerLoad } from './$types';
import type { Event } from '$appTypes';
import { CalID } from '$data';
import { CAL } from '$env/static/private';
import { Sanitizer } from '$lib';

export const load: PageServerLoad = async () => {
	let start = new Date();

	const processStringsWithDelays = (ids: string[]) => {
		const start = new Date();
		const end = new Date();
		end.setDate(start.getDate() + 30);

		const promisesArray = ids.map(async (id) => {
			return await (
				await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${id}/events?maxResults=10&timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&singleEvents=true&showDeleted=false&key=${CAL}`,
					{ method: 'GET' }
				)
			).json();
		});
		return Promise.all(promisesArray);
	};

	let eventsJSON = await processStringsWithDelays(CalID);
	let eventsIt = eventsJSON.flatMap((obj) => obj.items ?? []);
	const events: Event[] = eventsIt.map((e: any) => ({
		summary: e.summary,
		calLink: e.htmlLink,
		description: Sanitizer(e.description),
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
				? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(e.end.dateTime))
				: undefined
		}
	})) as Event[];

	return { events };
};
