import mongoose, { model, Schema } from 'mongoose';
import type { User } from '$lib/types/user.d.ts';

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
		type: Map,
		of: String,
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

const UserModel = mongoose.models.User || model('User', UserSchema);
export default UserModel;
