import mongoose, { model, Schema } from 'mongoose';
import type { EventLocation } from '$lib/types/event-location.d.ts';

const eventLocationSchema = new Schema<EventLocation>({
	name: {
		type: String,
		required: true
	},
	street: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	zip: {
		type: String,
		required: false
	},
	slug: {
		type: String,
		required: true
	}
});

const EventLocationModel =
	mongoose.models.EventLocation || model('EventLocation', eventLocationSchema);

export default EventLocationModel;
