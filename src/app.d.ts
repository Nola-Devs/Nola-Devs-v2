// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { LngLatLike } from "mapbox-gl";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface Event {
	group: string | undefined
	summary: string;
	calLink: string;
	description: string;
	location: string;
	lnglat: LngLatLike;
	start: {
		date: string;
		time: string | undefined;
	};
	end: {
		date: string;
		time: string | undefined;
	};
}

type linkKey =
	| 'linkedin'
	| 'facebook'
	| 'twitter'
	| 'github'
	| 'twitch'
	| 'eventbrite'
	| 'meetup'
	| 'youtube'
	| 'linktr'
	| 'email'
	| 'website'
	| string;

type Link = { [key: linkKey]: string };

type Organizers = {
	name: string;
	pfp: string;
	links: Link;
};

interface Group {
	group: string;
	about: string;
	calID: string;
	orgLinks: Link;
	organizers: Organizers[];
	events: Event[];
}

export { Event, Group, Organizers };
