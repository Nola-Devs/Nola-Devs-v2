import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const LocationSchema = new Schema({
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

export const LocationModel = model('Location', LocationSchema);

export const loadLocations = async () => {
	const data = await fs.readFile('src/lib/scripts/data/locations.json', 'utf-8');
	const locations = JSON.parse(data);

	await LocationModel.collection.drop();
	await LocationModel.bulkSave(locations.map((e) => new LocationModel(e)));
};
