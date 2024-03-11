import type { Event } from '$types';
import type { LngLatLike } from 'mapbox-gl';

export const eventParser = (e:any) => {
	return {
		group: e.group,
		summary: e.summary,
		calLink: e.htmlLink,
		description: e.description,
		location: e.location,
		lnglat: e.latLon,
		dateTime: new Date(e.start?.dateTime),
		start: {
			date: e.start?.dateTime
				? new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(e.start.dateTime))
				: new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(e.start.date)),
			time: e.start?.dateTime
				? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
						new Date(e.start.dateTime)
				  )
				: undefined
		},
		end: {
			date: e.end?.dateTime
				? new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(e.end.dateTime))
				: new Intl.DateTimeFormat('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
				  }).format(new Date(e.end.date)),
			time: e.end?.dateTime
				? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
						new Date(e.end.dateTime)
				  )
				: undefined
		}
	} as Event;
};
