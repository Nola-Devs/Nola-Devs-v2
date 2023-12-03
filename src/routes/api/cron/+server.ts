import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Event } from '../../../app.js';
import { CRON_SECRET, CAL } from '$env/static/private';
import { CalList } from '../../../data/index.js';
import { writeFileSync } from 'fs';

export const GET = ({ request }) => {
	console.log(CalList);
	// auth
	const authHeader = request.headers.get('authorization');
	console.log(authHeader, CRON_SECRET);
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('nope');
	}

	const processStringsWithDelays = (cals: any[]) => {
		const start = new Date();
		const end = new Date();
		end.setDate(start.getDate() + 30);

		const promisesArray = cals.map(async (cal) => {
			const data = await (
				await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${
						cal.id
					}/events?maxResults=10&timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&singleEvents=true&showDeleted=false&key=${CAL}`,
					{ method: 'GET' }
				)
			).json();

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
				group: cal.name,
				events: events
			};
		});
		return Promise.all(promisesArray);
	};

	processStringsWithDelays(CalList).then((d) => {
		// let eventsIt = d.flatMap((obj) => obj.items ?? []);
		const jsonString = JSON.stringify(d, null, 2); // Use null and 2 for indentation
		writeFileSync('static/events/events.json', jsonString, 'utf-8');
		console.log(d);
	});

	return new Response('hit');
};
