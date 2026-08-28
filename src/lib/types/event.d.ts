import { EventLocation } from './event-location';

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
	announcementChannel?: string;
	announcementTs?: string;
	reposts?: Array<{ channel: string; ts: string }>;
	eventSlug?: string;
	groupSlug?: string;
	createdAt: Date;
}
