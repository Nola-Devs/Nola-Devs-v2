import slugify from 'slugify';
import mongoose, { model, Schema } from 'mongoose';
import type { Group } from '$lib/types/group.d.ts';

const groupSchema = new Schema<Group>({
	group: {
		type: String,
		required: false
	},
	slug: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true
	},
	about: {
		type: String,
		required: [true, 'About description is required'],
		maxlength: [2000, 'About description cannot exceed 2000 characters']
	},
	calID: {
		type: String,
		required: [false, 'Calendar ID is required']
	},
	links: {
		type: Map,
		of: String
	},
	icon: {
		type: String,
		required: false
	}
});

groupSchema.pre('save', function (next) {
	if (this.isNew || this.isModified('group')) {
		this.slug = slugify(this.group, { lower: true, strict: true });
	}
	next();
});

groupSchema.index({ slug: 1 });

const GroupModel = mongoose.models.Group || model('Group', groupSchema);

export default GroupModel;
