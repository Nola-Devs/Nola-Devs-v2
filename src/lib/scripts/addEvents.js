import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const eventSchema = new Schema({
	groupName: {
		type: String,
		required: true
	},
	meetupName: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	expireAt: {
		type: Date
	},
	location: {
		name: { type: String, required: true },
		street: { type: String },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip: { type: String },
		slug: { type: String, required: true }
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
	announcement: {
		type: String,
		required: false
	},
	eventSlug: {
		type: String,
		required: true,
		unique: false
	},
	groupSlug: {
		type: String,
		required: false
	},
	createdAt: {
		type: Date,
		required: true
	}
});

// mongodb will clean up expired events with this index
eventSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const EventModel = model('Event', eventSchema);

export const loadEvents = async () => {
	const data = await fs.readFile('src/lib/scripts/data/events.json', 'utf-8');
	const events = JSON.parse(data);

	await EventModel.collection.drop();
	await EventModel.bulkSave(events.map((e) => new EventModel(e)));
};
