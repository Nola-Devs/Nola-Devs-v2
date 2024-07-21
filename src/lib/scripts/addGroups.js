import { promises as fs } from 'fs';
import { model, Schema } from 'mongoose';

const groupSchema = new Schema({
	group: {
		type: String,
		required: false
	},
	slug: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true
	},
	about: {
		type: String,
		required: [true, 'About description is required'],
		maxlength: [2000, 'About description cannot exceed 2000 characters']
	},
	calID: {
		type: String,
		required: [false, 'Calendar ID is required']
	},
	links: {
		type: Map,
		of: String
	},
	icon: {
		type: String,
		required: false
	}
});

const GroupModel = model('Group', groupSchema);

export const loadGroups = async () => {
	const data = await fs.readFile('src/lib/scripts/data/groups.json', 'utf-8');
	const groups = JSON.parse(data);

	await GroupModel.collection.drop();
	await GroupModel.bulkSave(groups.map((e) => new GroupModel(e)));
};
