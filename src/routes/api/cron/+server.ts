import { CRON_SECRET } from '$env/static/private';
import EventModel from '$lib/db/events.js';
import { GroupModel } from '$lib/db/groups';
import { eventParser } from '$lib/utils/event-parser.js';
import { googleCalAPICall } from '$lib/utils/google-cal-api-cal.js';
import { revGeocode } from '$lib/utils/rev-geocode.js';
import type { Event, Group } from '$types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	// auth
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('You Shall Not Pass!', { status: 401 });
	}

	// TODO: add error handling
	// TODO: Check for expired sessions

	// /*
	//   This is the default calendar for the one off turn this into a pvt key
	//  545d217a064ce6f846e820045fccdaae17db65ee1b53dc14ea249833b94d0f70@group.calendar.google.com
	// */

	const calList: Group[] = await GroupModel.find({}).select(['group', 'calID']);
	// TODO: Change all Promise.all into Promise.allSettled for better error handling
	const events = (
		await Promise.all(
			Object.values(calList)
				.map((e) => e.calID)
				.map(googleCalAPICall)
		)
	)
		.map((eventsObj, i) =>
			eventsObj.items.map((event: any): any => {
				return { ...event, group: calList[i].group };
			})
		)
		.flat();

	const eventsWithLatLon = (
		await Promise.all(
			Object.values(events)
				.map((e) => e.location)
				.map(revGeocode)
		)
	).map((e, i) => ({ ...events[i], latLon: e }));

	const parseEvents: Event[] = eventsWithLatLon.map((e) => eventParser(e));

	console.log(parseEvents);
	EventModel.collection.drop();

	EventModel.bulkSave(parseEvents.map((e) => new EventModel(e)));

	return new Response(JSON.stringify(parseEvents), { status: 200 });
};
