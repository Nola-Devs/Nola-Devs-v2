import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const eventSchema = new Schema({
	group: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	calLink: String,
	description: String,
	location: String,
	lnglat: {
		type: [Number],
		index: '2dsphere'
	},
	start: {
		type: Date,
		required: true
	},
	end: Date,
	eventSlug: { type: String, required: true, unique: true },
	groupSlug: { type: String, required: true }
});

const EventModel = model('Event', eventSchema);

export const loadEvents = async () => {
	const data = await fs.readFile('src/lib/scripts/data/events.json', 'utf-8');
	const events = JSON.parse(data);

	await EventModel.collection.drop();
	await EventModel.bulkSave(events.map((e) => new EventModel(e)));
};
