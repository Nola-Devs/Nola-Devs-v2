export interface Vendor {
	_id?: string;
	name: string;
	defaultSlicesPerPerson: number;
	defaultSlicesPerPie: number;
	defaultLeadTimeHours: number;
	url?: string;
	createdByUserId?: string;
	isShared: boolean;
}
