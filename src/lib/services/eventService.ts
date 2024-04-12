import type { PageServerLoad } from './$types';
import EventModel from '$lib/db/events';
import type { Event } from '$lib/types/event.d.ts';
import { error } from '@sveltejs/kit';

export class eventService  {

  async getEvents() {

         const events = (await EventModel.find({})
		.sort({ dateTime: 'asc' })
		.select(['-_id', '-__v'])
		.lean()
		.limit(4)) as unknown as Event[];
	return {events};
   };

   async getEventsByGroup(slug) :  Promise<Event[]>{

    const events: Event[] | null = await EventModel.find({ groupSlug: slug }).select('-_id -__v').lean();

    if (!events) {
    throw new Error('events not found');
    }
    
    return events;
   }

   async getEventsByEventSlug(params) {

    const { eventSlug } = params;
    const event: Event | null = await EventModel.findOne({ eventSlug }).select('-_id -__v').lean();

    if (!event) {
        throw new Error('Event not found');
    }

    // Perform any additional data transformations or fetches here
    return {event};	
}
}

