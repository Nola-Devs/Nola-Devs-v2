import { CRON_SECRET } from '$env/static/private';
import connectDB from '$lib/db/db';
import EventModel from '$lib/db/events.js';
import GroupModel from '$lib/db/groups';
import { eventParser } from '$lib/utils/event-parser.js';
import { googleCalAPICall } from '$lib/utils/google-cal-api-cal.js';
import { geocode } from '$lib/utils/geocode.js';
import type { Event, Group, googleCalAPIType } from '$types';
import type { RequestHandler } from './$types';
import type { LngLatLike } from 'mapbox-gl';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('You Shall Not Pass!', { status: 401 });
	}

	await connectDB();
	const calIDsAndGroupNames: Group[] = await GroupModel.find({}).select(['-_id', 'group', 'calID'])

	

	const eventsFromAllCals: Promise<googleCalAPIType[]>[] = calIDsAndGroupNames.map(e => googleCalAPICall(e))

	const resultsFromGoogleAPI: (googleCalAPIType | undefined)[] =
		(await Promise.allSettled(eventsFromAllCals)).map(e => {
			if (e.status == 'fulfilled') {
				return e.value
			}
		}).flat().filter(e=> e!==undefined)

	

	type geocodeOnEvent = googleCalAPIType & {
		lnglat: [Number, Number];
	};


	const geocodedEvents: (Promise<geocodeOnEvent>|undefined)[] = resultsFromGoogleAPI.map(e => {
		if(e !== undefined){
			return geocode(e)
		} 
	})



	const resultsFromMapBoxAPI: (geocodeOnEvent | undefined)[] = (await Promise.allSettled(geocodedEvents)).map(e => {
		if (e.status == 'fulfilled') {
			return e.value
		}
	});


	const events: Event[] = resultsFromMapBoxAPI.map(eventParser)


	

	EventModel.collection.drop();
	EventModel.bulkSave(events.map((e) => new EventModel(e)));

	return new Response(JSON.stringify("yes"), { status: 200 });
};
