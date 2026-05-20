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
	},
	pizza: {
		vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: false },
		slicesPerPerson: { type: Number, required: false, min: 0.5, max: 10 },
		slicesPerPie: { type: Number, required: false, min: 1, max: 24 },
		leadTimeHours: { type: Number, required: false, min: 0, max: 168 },
		bufferMultiplier: { type: Number, required: false, default: 1.2, min: 1, max: 3 }
	},
	rsvpStats: {
		totalRsvps: { type: Number, required: false },
		totalHeadcount: { type: Number, required: false },
		totalSlices: { type: Number, required: false },
		finalizedAt: { type: Date, required: false }
	}
});

// mongodb will clean up expired events with this index
eventSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const EventModel = mongoose.models.Event || model('Event', eventSchema);

export default EventModel;
