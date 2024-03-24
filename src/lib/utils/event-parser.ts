import slugify from 'slugify';
import type { googleCalAPIType } from '$types';
import type { Event } from '$lib/types/Event';
import type { LngLatLike } from 'mapbox-gl';

type geocodeOnEvent = googleCalAPIType & {
	lnglat?: LngLatLike;
};

const convertToLngLat = (lnglat?: LngLatLike): [number, number] => {
	if (
		Array.isArray(lnglat) &&
		lnglat.length === 2 &&
		typeof lnglat[0] === 'number' &&
		typeof lnglat[1] === 'number'
	) {
		return lnglat as [number, number];
	} else if (lnglat && 'lng' in lnglat && 'lat' in lnglat) {
		// Handle object format { lng: number, lat: number }
		return [lnglat.lng, lnglat.lat];
	}
	// Default or error handling if lnglat is not as expected
	return [0, 0];
};

const formatDateForSlug = (date: Date) => {
	return `${(date.getMonth() + 1).toString().padStart(2, '0')}${date
		.getDate()
		.toString()
		.padStart(2, '0')}${date.getFullYear()}`;
};

export const eventParser = (eventData: geocodeOnEvent | undefined): Partial<Event> => {
	const {
		group = '',
		summary = '',
		htmlLink: calLink = '',
		description = '',
		location = '',
		lnglat,
		start,
		end
	} = eventData || {};

	// Simplify the date part of the slug
	const eventDate = start?.dateTime ? new Date(start.dateTime) : new Date();
	const dateStringForSlug = formatDateForSlug(eventDate);

	// Generate the slug without dots and with a simpler date
	const eventSlug = slugify(`${summary}-${dateStringForSlug}`, {
		lower: true,
		strict: true, // Removes characters that are not url-friendly
		remove: /[*+~.()'"!:@]/g // Additional characters removal including dot
	});

	const groupSlug = slugify(group, {
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g
	});

	const startDate = start?.dateTime ? new Date(start.dateTime) : new Date();
	const endDate = end?.dateTime ? new Date(end.dateTime) : new Date();

	const parsedEvent: Partial<Event> = {
		group,
		summary,
		calLink,
		description,
		location,
		lnglat: convertToLngLat(lnglat),
		start: startDate,
		end: endDate,
		eventSlug,
		groupSlug
	};

	return parsedEvent;
};
