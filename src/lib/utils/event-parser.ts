import type { Event } from '$types';

export const eventParser = (event: {
	summary: string;
	htmlLink: string;
	description: string;
	location: string;
	latLon: [number, number];
	start: { dateTime: string | number | Date; date: string | number | Date };
	end: { dateTime: string | number | Date; date: string | number | Date };
	group: string;
}) => {
	return {
		group: event.group,
		summary: event.summary,
		calLink: event.htmlLink,
		description: event.description,
		location: event.location,
		lnglat: event.latLon,
		dateTime: new Date(event.start?.dateTime),
		start: {
			date: event.start?.dateTime
				? new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(event.start.dateTime))
				: new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(event.start.date)),
			time: event.start?.dateTime
				? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
						new Date(event.start.dateTime)
				  )
				: undefined
		},
		end: {
			date: event.end?.dateTime
				? new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(event.end.dateTime))
				: new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(event.end.date)),
			time: event.end?.dateTime
				? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
						new Date(event.end.dateTime)
				  )
				: undefined
		}
	} as Event;
};
