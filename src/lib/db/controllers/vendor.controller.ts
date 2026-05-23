import { error } from '@sveltejs/kit';
import VendorModel from '../models/vendors.model';
import type { Vendor } from '$lib/types/vendor.d.ts';
import type { UserRole } from '$lib/types/user.d.ts';

interface ActingUser {
	id: string;
	role: UserRole;
}

export const vendorController = {
	list: async (): Promise<Vendor[]> => {
		const docs = await VendorModel.find({}).sort({ isShared: -1, name: 1 }).lean<
			{
				_id: { toString(): string };
				name: string;
				defaultSlicesPerPerson: number;
				defaultSlicesPerPie: number;
				defaultLeadTimeHours: number;
				url?: string;
				createdByUserId?: { toString(): string };
				isShared: boolean;
			}[]
		>();
		return docs.map((d) => ({
			_id: d._id.toString(),
			name: d.name,
			defaultSlicesPerPerson: d.defaultSlicesPerPerson,
			defaultSlicesPerPie: d.defaultSlicesPerPie,
			defaultLeadTimeHours: d.defaultLeadTimeHours,
			url: d.url,
			createdByUserId: d.createdByUserId?.toString(),
			isShared: d.isShared
		}));
	},

	create: async (
		input: Omit<Vendor, '_id' | 'createdByUserId' | 'isShared'>,
		actor: ActingUser
	): Promise<Vendor> => {
		if (actor.role !== 'super' && actor.role !== 'orgAdmin') {
			throw error(403, 'Not allowed to create vendors');
		}
		const isShared = actor.role === 'super';
		const doc = await VendorModel.create({ ...input, createdByUserId: actor.id, isShared });
		return {
			_id: doc._id.toString(),
			name: doc.name,
			defaultSlicesPerPerson: doc.defaultSlicesPerPerson,
			defaultSlicesPerPie: doc.defaultSlicesPerPie,
			defaultLeadTimeHours: doc.defaultLeadTimeHours,
			url: doc.url,
			createdByUserId: actor.id,
			isShared
		};
	},

	delete: async (vendorId: string, actor: ActingUser): Promise<void> => {
		const vendor = await VendorModel.findById(vendorId);
		if (!vendor) throw error(404, 'Vendor not found');

		if (actor.role === 'super') {
			await vendor.deleteOne();
			return;
		}
		if (actor.role === 'orgAdmin') {
			if (vendor.isShared) throw error(403, 'Cannot delete shared vendor');
			if (vendor.createdByUserId?.toString() !== actor.id) {
				throw error(403, 'Cannot delete a vendor you did not create');
			}
			await vendor.deleteOne();
			return;
		}
		throw error(403, 'Not allowed');
	}
};
