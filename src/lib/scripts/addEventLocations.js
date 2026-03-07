import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const eventLocationSchema = new Schema({
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

export const EventLocationModel = model('EventLocation', eventLocationSchema);

export const loadLocations = async () => {
	const data = await fs.readFile('src/lib/scripts/data/event-locations.json', 'utf-8');
	const locations = JSON.parse(data);

	await EventLocationModel.collection.drop();
	await EventLocationModel.bulkSave(locations.map((e) => new EventLocationModel(e)));
};
