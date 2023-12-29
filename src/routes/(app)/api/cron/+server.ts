import type { Group, Event } from '$types';
import { CRON_SECRET } from '$env/static/private';
import { googleCalAPICall } from '$lib/utils/google-cal-api-cal.js';
import { GroupModel } from '$lib/db/groups';
import { revGeocode } from '$lib/utils/rev-geocode.js';
import { eventParser } from '$lib/utils/event-parser.js';
import EventModel from '$lib/db/events.js';

export const GET = async ({ request }) => {
	// auth
	const authHeader = request.headers.get('authorization');
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('You Shall Not Pass!', { status: 401 });
	}

	const calList: Group[] = await GroupModel.find({}).select(['group', 'calID']);

	const events = (
		await Promise.all(
			Object.values(calList)
				.map((e) => e.calID)
				.map(googleCalAPICall)
		)
	)
		.map((eventsObj, i) =>
			eventsObj.items.map((event: any) => ({ ...event, group: calList[i].group }))
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

	EventModel.collection.drop();

	EventModel.bulkSave(parseEvents.map((e) => new EventModel(e)));

	return new Response(JSON.stringify(events), { status: 200 });
};
