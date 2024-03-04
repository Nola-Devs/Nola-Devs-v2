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
	group: string | undefined;
	summary: string;
	calLink: string;
	description: string;
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

export { Event, Group, User };
