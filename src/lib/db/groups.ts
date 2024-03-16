import { model, Schema } from 'mongoose';
import type { Group } from '$types';

const groupSchema = new Schema<Group>({
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
	},
	icon:{
		type: String,
		required: false
	}
});

const GroupModel = model('Group', groupSchema);

export default GroupModel;
