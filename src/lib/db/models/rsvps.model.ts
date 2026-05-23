import mongoose, { model, Schema } from 'mongoose';
import type { Rsvp } from '$lib/types/rsvp.d.ts';

export const RSVP_HEADCOUNT_MAX = 5;
export const RSVP_SLICES_MAX = 8;

const RsvpSchema = new Schema<Rsvp>({
	eventId: { type: String, ref: 'Event', required: true, index: true },
	email: { type: String, required: true, lowercase: true, trim: true },
	name: { type: String, required: false, trim: true },
	headcount: { type: Number, required: true, min: 1, max: RSVP_HEADCOUNT_MAX, default: 1 },
	slices: { type: Number, required: true, min: 0, max: RSVP_SLICES_MAX, default: 2 },
	editToken: { type: String, required: true, index: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	expiresAt: { type: Date, required: true }
});

RsvpSchema.index({ eventId: 1, email: 1 }, { unique: true });
RsvpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RsvpModel = mongoose.models.Rsvp || model('Rsvp', RsvpSchema);
export default RsvpModel;
