import mongoose, { model, Schema } from 'mongoose';

const SessionSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	expire: {
		type: Date,
		required: true
	},
	user: {
		type: String,
		required: true
	}
});

const SessionModel = mongoose.models.Session || model('Session', SessionSchema);

export default SessionModel;
