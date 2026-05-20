import { EventLocation } from './event-location';

export interface PizzaConfig {
	vendorId?: string;
	slicesPerPerson?: number;
	slicesPerPie?: number;
	leadTimeHours?: number;
	bufferMultiplier?: number;
}

export interface RsvpStats {
	totalRsvps: number;
	totalHeadcount: number;
	totalSlices: number;
	finalizedAt: Date;
}

export interface Event {
	groupName: string;
	meetupName: string;
	description: string;
	start: Date;
	end: Date;
	expireAt: Date;
	location: EventLocation;
	locationNotes?: string;
	eventLink?: string;
	rsvpLink?: string;
	announcement?: string;
	eventSlug?: string;
	groupSlug?: string;
	createdAt: Date;
	pizza?: PizzaConfig;
	rsvpStats?: RsvpStats;
}
