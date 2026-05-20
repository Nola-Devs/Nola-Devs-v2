import mongoose, { model, Schema } from 'mongoose';
import type { Vendor } from '$lib/types/vendor.d.ts';

const VendorSchema = new Schema<Vendor>({
	name: { type: String, required: true, trim: true, unique: true },
	defaultSlicesPerPerson: { type: Number, required: true, default: 2.5, min: 0.5, max: 10 },
	defaultSlicesPerPie: { type: Number, required: true, default: 8, min: 1, max: 24 },
	defaultLeadTimeHours: { type: Number, required: true, default: 4, min: 0, max: 168 },
	url: { type: String, required: false },
	createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
	isShared: { type: Boolean, required: true, default: false, index: true }
});

const VendorModel = mongoose.models.Vendor || model('Vendor', VendorSchema);
export default VendorModel;
