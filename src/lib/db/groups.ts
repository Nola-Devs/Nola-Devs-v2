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
	orgLinks: {
		type: Object,
		required: false
	},
	organizers: [
		{
			type: Object,
			required: false
		}
	],
	events: [
		{
			type: Object,
			required: false
		}
	]
});

export const GroupModel = model('Group', groupSchema);


