import mongoose, { model, Schema } from 'mongoose';
import type { Event } from '$lib/types/event.d.ts';

const eventSchema = new Schema<Event>({
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
	// where the announcement was posted, so it can be edited in place later
	announcementChannel: {
		type: String,
		required: false
	},
	announcementTs: {
		type: String,
		required: false
	},
	// every channel the announcement was linked into, so the links can be cleaned
	// up when the event is cancelled
	reposts: {
		type: [
			{
				_id: false,
				channel: { type: String, required: true },
				ts: { type: String, required: true }
			}
		],
		required: false,
		default: undefined
	},
	eventSlug: {
		type: String,
		required: true,
		unique: false
	},
	groupSlug: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true
	}
});

// mongodb will clean up expired events with this index
eventSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const EventModel = mongoose.models.Event || model('Event', eventSchema);

export default EventModel;
