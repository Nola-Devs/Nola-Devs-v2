export interface Rsvp {
	_id?: string;
	eventId: string;
	email: string;
	name?: string;
	headcount: number;
	slices: number;
	editToken: string;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date;
}
