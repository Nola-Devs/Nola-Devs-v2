import { model, Schema } from 'mongoose';
import type { Event } from '$types';

const eventSchema = new Schema<Event>({
	group: String,
	summary: String,
	calLink: String,
	description: String,
	location: String,
	lnglat: [Number, Number],
	start: Date,
	end: Date,   
});

const EventModel = model('Event', eventSchema);

export default EventModel;
