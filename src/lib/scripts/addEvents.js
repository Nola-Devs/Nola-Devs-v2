import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const eventSchema = new Schema({
	meetupName: {
		type: String,
		required: true
	},
	groupName: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	locationNotes: {
		type: String,
		required: false
	},
	eventLink: {
		type: String,
		required: false
	},
	rsvpLink: {
		type: String,
		required: false
	},
	announcementHeading: {
		type: String,
		required: false
	},
	eventSlug: {
		type: String,
		required: true,
		unique: true
	},
	groupSlug: {
		type: String,
		required: true
	}
});

const EventModel = model('Event', eventSchema);

export const loadEvents = async () => {
	const data = await fs.readFile('src/lib/scripts/data/events.json', 'utf-8');
	const events = JSON.parse(data);

	await EventModel.collection.drop();
	await EventModel.bulkSave(events.map((e) => new EventModel(e)));
};
