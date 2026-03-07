import { EventLocation } from './event-location';

export interface Event {
	groupName: string;
	meetupName: string;
	description: string;
	start: Date;
	end: Date;
	location: EventLocation;
	locationNotes?: string;
	eventLink?: string;
	rsvpLink?: string;
	announcement?: string;
	eventSlug?: string;
	groupSlug?: string;
	createdAt: Date;
}
