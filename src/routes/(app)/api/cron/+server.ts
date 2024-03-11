import { CRON_SECRET } from '$env/static/private';
import EventModel from '$lib/db/events.js';
import { GroupModel } from '$lib/db/groups';
import { eventParser } from '$lib/utils/event-parser.js';
import { googleCalAPICall } from '$lib/utils/google-cal-api-cal.js';
import { geocode } from '$lib/utils/geocode.js';
import { start_db } from '$lib/db/db';
import type { Event, Group } from '$types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('You Shall Not Pass!', { status: 401 });
	}

	const calIDsAndGroupNames: Group[] = await GroupModel.find({}).select(['-_id', 'group', 'calID'])


	const eventsFromAllCals = calIDsAndGroupNames.map(e => googleCalAPICall(e))

	const resultsFromGoogleAPI = (await Promise.allSettled(eventsFromAllCals)).map(e=> {
		if(e.status == 'fulfilled') {
			return e.value 
		}
	}).flat();

	
	const geocodedEvents = resultsFromGoogleAPI.map(e=> geocode(e))
	
	const resultsFromMapBoxAPI = (await Promise.allSettled(geocodedEvents)).map(e=> {
		if(e.status == 'fulfilled') {
			return e.value 
		}
	});

	const events = resultsFromMapBoxAPI.map(eventParser)



	//console.log(events)

	EventModel.collection.drop();
	EventModel.bulkSave(events.map((e) => new EventModel(e)));

	return new Response(JSON.stringify("yes"), { status: 200 });
};
