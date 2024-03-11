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

	const parsedEvent: Event = {
		group: group || '',
		summary: summary || '',
		calLink: calLink || '',
		description: description || '',
		location: location || '',
		lnglat: lnglat || ({} as LngLatLike),
		start: new Date(start?.dateTime),
		end: new Date(end?.dateTime),
	};

	return parsedEvent as Event;
};
