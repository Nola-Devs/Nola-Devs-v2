import { PUBLIC_MAPBOX } from '$env/static/public';
import type { LngLatLike } from 'mapbox-gl';
import type { googleCalAPIType } from '$lib/types/google-api.d.ts';

type geocodeOnEvent = googleCalAPIType & {
	lnglat: LngLatLike;
};

/**
 * Geocode the location of a calendar event.
 * @param eventData
 * @returns {Object} success: event with geocoded location. fallback: event with default location of New Orleans.
 */
export const geocode = async (eventData: googleCalAPIType | undefined): Promise<geocodeOnEvent> => {
	if (!eventData || !eventData.location || eventData.location.match(/^http/)) {
		return {
			...eventData,
			lnglat: [-90.071533, 29.951065], // New Orleans default coords
			kind: 'calendar#event'
		} as geocodeOnEvent;
	}

	const locationURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		eventData.location
	)}.json?access_token=${PUBLIC_MAPBOX}`;

	try {
		const response = await fetch(locationURL, { method: 'GET' });
		if (!response.ok) throw new Error('Failed to fetch from Mapbox API');

		const { features } = await response.json();
		if (features.length === 0) throw new Error('No geocode results');

		return {
			...eventData,
			lnglat: features[0].center,
			kind: eventData.kind || 'calendar#event' // Use existing kind or default
		} as geocodeOnEvent;
	} catch (error) {
		console.error('Error geocoding event location:', error);
		return {
			...eventData,
			lnglat: [-90.071533, 29.951065], // Fallback coordinates
			kind: 'calendar#event'
		} as geocodeOnEvent;
	}
};
