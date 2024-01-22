import groups from './data/groups.json' assert { type: 'json' };
import { model, Schema } from 'mongoose';

const groupSchema = new Schema({
	group: {
		type: String,
		required: false
	},
	about: {
		type: String,
		required: true
	},
	calID: {
		type: String,
		required: true
	},
	links: {
		type: Object,
		required: false
	}
});

const GroupModel = model('Group', groupSchema);

export const loadGroups = async () => {
	const res = await GroupModel.bulkSave(groups.map((e) => new GroupModel(e)));
	console.log(res);
};
