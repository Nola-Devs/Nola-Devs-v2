import mongoose, { model, Schema } from 'mongoose';
import type { Vendor } from '$lib/types/vendor.d.ts';

const VendorSchema = new Schema<Vendor>({
	name: { type: String, required: true, trim: true },
	defaultSlicesPerPerson: { type: Number, required: true, default: 2.5, min: 0.5, max: 10 },
	defaultSlicesPerPie: { type: Number, required: true, default: 8, min: 1, max: 24 },
	defaultLeadTimeHours: { type: Number, required: true, default: 4, min: 0, max: 168 },
	url: { type: String, required: false },
	createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
	isShared: { type: Boolean, required: true, default: false, index: true }
});

// Shared vendors must have unique names globally; private vendors are scoped
// per-creator so two orgAdmins can both have a "Domino's" entry.
VendorSchema.index(
	{ name: 1 },
	{ unique: true, partialFilterExpression: { isShared: true } }
);
VendorSchema.index(
	{ name: 1, createdByUserId: 1 },
	{ unique: true, partialFilterExpression: { isShared: false } }
);

const VendorModel = mongoose.models.Vendor || model('Vendor', VendorSchema);
export default VendorModel;
