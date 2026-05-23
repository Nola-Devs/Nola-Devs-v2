import mongoose, { model, Schema } from 'mongoose';
import type { User } from '$lib/types/user.d.ts';

const UserSchema = new Schema<User>({
	githubId: { type: Number, required: false, unique: true, sparse: true, index: true },
	email: { type: String, required: true, lowercase: true, trim: true },
	name: { type: String, required: false },
	avatarUrl: { type: String, required: false },
	role: {
		type: String,
		required: true,
		enum: ['super', 'orgAdmin', 'member'],
		default: 'member'
	},
	groupIds: [{ type: Schema.Types.ObjectId, ref: 'Group', default: [] }],
	createdAt: { type: Date, default: Date.now },

	pfp: { type: String, required: false },
	links: { type: Map, of: String, required: false },
	group: { type: String, required: false }
});

const UserModel = mongoose.models.User || model('User', UserSchema);
export default UserModel;
