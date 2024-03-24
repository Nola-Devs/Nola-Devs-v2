type GroupLinkKey =
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

type GroupLinks = { [key in GroupLinkKey]: string };

export interface Group {
	group: string;
	slug: string;
	about: string;
	calID: string;
	links: GroupLinks;
	icon: string;
}
