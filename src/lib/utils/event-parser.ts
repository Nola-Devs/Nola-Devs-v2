import type { Event, googleCalAPIType } from '$types';
import type { LngLatLike } from 'mapbox-gl';

type geocodeOnEvent = googleCalAPIType & {
	lnglat: LngLatLike;
  };

export const eventParser = (eventData: geocodeOnEvent|undefined ): Event => {
	const {
		group,
		summary,
		htmlLink: calLink,
		description,
		location,
		lnglat,
		start,
		end,
	} = eventData || {};


	const formatDate = (dateString: string ) =>
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(dateString))



	const formatTime = (dateTimeString: string ) =>
		 new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
				new Date(dateTimeString)
			)
			


	const parsedEvent: Event = {
		group: group || '',
		summary: summary || '',
		calLink: calLink || '',
		description: description || '',
		location: location || '',
		lnglat: lnglat || ({} as LngLatLike),
		dateTime:  new Date(start?.dateTime) || new Date(),
		start: {
			date: formatDate(start?.dateTime) || '',
			time: formatTime(start?.dateTime) || '',
		},
		end: {
			date: formatDate(end?.dateTime) || '',
			time: formatTime(end?.dateTime)|| '',
		},
	};

	return parsedEvent as Event;
};
