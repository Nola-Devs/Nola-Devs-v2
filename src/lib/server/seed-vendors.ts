import VendorModel from '$lib/db/models/vendors.model';

const SHARED_VENDORS = [
	{
		name: 'Pizza Delicious',
		defaultSlicesPerPerson: 2.5,
		defaultSlicesPerPie: 8,
		defaultLeadTimeHours: 4,
		url: 'https://pizzadelicious.com'
	},
	{
		name: 'Magazine Pizza',
		defaultSlicesPerPerson: 2,
		defaultSlicesPerPie: 8,
		defaultLeadTimeHours: 4,
		url: 'https://magazinepizza.com'
	}
];

let seeded = false;

export async function seedSharedVendors(): Promise<void> {
	if (seeded) return;
	for (const v of SHARED_VENDORS) {
		await VendorModel.updateOne(
			{ name: v.name, isShared: true },
			{ $setOnInsert: { ...v, isShared: true } },
			{ upsert: true }
		);
	}
	seeded = true;
}
