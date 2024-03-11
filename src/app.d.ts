// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { LngLatLike } from 'mapbox-gl';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface Event {
	group: string ;
	summary: string  ;
	calLink: string;
	description: string ;
	location: string;
	lnglat: LngLatLike;
	dateTime: Date;
	start: {
		date: string;
		time: string | undefined;
	};
	end: {
		date: string;
		time: string | undefined;
	};
}

type groupLinkKey =
	| 'linkedin'
	| 'facebook'
	| 'twitter'
	| 'twitch'
	| 'eventbrite'
	| 'meetup'
	| 'youtube'
	| 'linktr'
	| 'email'
	| 'website';

type userLinkKey = 'website' | 'github' | 'linkedin' | 'twitter';

type groupLinks = { [key: groupLinkKey]: string };
type userLinks = { [key: userLinkKey]: string };

type User = {
	name: string;
	pfp: string;
	links: userLinks;
	email: string;
	password: string;
	role: string;
	group: string;
};

interface Group {
	group: string;
	about: string;
	calID: string;
	links: groupLinks;
}


type googleCalAPIType = {
	"kind": "calendar#event",
	"etag": etag,
	"id": string,
	"status": string,
	"htmlLink": string,
	"created": datetime,
	"updated": datetime,
	"summary": string,
	"description": string,
	"location": string,
	"colorId": string,
	"creator": {
	  "id": string,
	  "email": string,
	  "displayName": string,
	  "self": boolean
	},
	"organizer": {
	  "id": string,
	  "email": string,
	  "displayName": string,
	  "self": boolean
	},
	"start": {
	  "date": date,
	  "dateTime": datetime,
	  "timeZone": string
	},
	"end": {
	  "date": date,
	  "dateTime": datetime,
	  "timeZone": string
	},
	"endTimeUnspecified": boolean,
	"recurrence": [
	  string
	],
	"recurringEventId": string,
	"originalStartTime": {
	  "date": date,
	  "dateTime": datetime,
	  "timeZone": string
	},
	"transparency": string,
	"visibility": string,
	"iCalUID": string,
	"sequence": integer,
	"attendees": [
	  {
		"id": string,
		"email": string,
		"displayName": string,
		"organizer": boolean,
		"self": boolean,
		"resource": boolean,
		"optional": boolean,
		"responseStatus": string,
		"comment": string,
		"additionalGuests": integer
	  }
	],
	"attendeesOmitted": boolean,
	"extendedProperties": {
	  "private": {
		(key): string
	  },
	  "shared": {
		(key): string
	  }
	},
	"hangoutLink": string,
	"conferenceData": {
	  "createRequest": {
		"requestId": string,
		"conferenceSolutionKey": {
		  "type": string
		},
		"status": {
		  "statusCode": string
		}
	  },
	  "entryPoints": [
		{
		  "entryPointType": string,
		  "uri": string,
		  "label": string,
		  "pin": string,
		  "accessCode": string,
		  "meetingCode": string,
		  "passcode": string,
		  "password": string
		}
	  ],
	  "conferenceSolution": {
		"key": {
		  "type": string
		},
		"name": string,
		"iconUri": string
	  },
	  "conferenceId": string,
	  "signature": string,
	  "notes": string,
	},
	"gadget": {
	  "type": string,
	  "title": string,
	  "link": string,
	  "iconLink": string,
	  "width": integer,
	  "height": integer,
	  "display": string,
	  "preferences": {
		(key): string
	  }
	},
	"anyoneCanAddSelf": boolean,
	"guestsCanInviteOthers": boolean,
	"guestsCanModify": boolean,
	"guestsCanSeeOtherGuests": boolean,
	"privateCopy": boolean,
	"locked": boolean,
	"reminders": {
	  "useDefault": boolean,
	  "overrides": [
		{
		  "method": string,
		  "minutes": integer
		}
	  ]
	},
	"source": {
	  "url": string,
	  "title": string
	},
	"workingLocationProperties": {
	  "type": string,
	  "homeOffice": (value),
	  "customLocation": {
		"label": string
	  },
	  "officeLocation": {
		"buildingId": string,
		"floorId": string,
		"floorSectionId": string,
		"deskId": string,
		"label": string
	  }
	},
	"outOfOfficeProperties": {
	  "autoDeclineMode": string,
	  "declineMessage": string
	},
	"focusTimeProperties": {
	  "autoDeclineMode": string,
	  "declineMessage": string,
	  "chatStatus": string
	},
	"attachments": [
	  {
		"fileUrl": string,
		"title": string,
		"mimeType": string,
		"iconLink": string,
		"fileId": string
	  }
	],
	"eventType": string,
	group: string
  }

export { Event, Group, User, googleCalAPIType };
