import mongoose, { model, Schema } from 'mongoose';

export interface Session {
	_id: string;
	userId: string;
	expiresAt: Date;
}

const SessionSchema = new Schema<Session>({
	_id: { type: String, required: true },
	userId: { type: String, ref: 'User', required: true, index: true },
	expiresAt: { type: Date, required: true }
});

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel = mongoose.models.Session || model<Session>('Session', SessionSchema);
export default SessionModel;
