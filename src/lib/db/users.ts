import { model, Schema } from 'mongoose';
import type { User } from '$types';

const UserSchema = new Schema<User>({
	name: {
		type: String,
		required: false
	},
	pfp: {
		type: String,
		required: false
	},
	links: {
		type: Object,
		required: false
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true
	},
	group: {
		type: String,
		required: false
	}
});

const UserModel = model('User', UserSchema);
export default UserModel;
