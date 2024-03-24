import { PUBLIC_MAPBOX } from '$env/static/public';

import type { googleCalAPIType } from '$types';

type geocodeOnEvent = googleCalAPIType & {
	lnglat: [number,number];
};

export const geocode = async (e: googleCalAPIType): Promise<geocodeOnEvent> => {

	const address = e?.location

	let resLngLat
	if (!address?.match(/^http/) && address !== undefined) {
		const locationURL = (address: string) =>
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${PUBLIC_MAPBOX}`;

		const req = await (
			await fetch(locationURL(address), { method: 'GET' })
		).json();
		resLngLat = req.features[0].center
	}
	return { ...e, lnglat: resLngLat ? resLngLat : [-90.071533, 29.951065] }
};
