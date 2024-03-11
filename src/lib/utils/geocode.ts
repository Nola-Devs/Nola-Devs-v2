import { PUBLIC_MAPBOX } from '$env/static/public';
import type { LngLatLike } from 'mapbox-gl';

export const geocode = async (e: any) => {
	const address = e.location

	

	const locationURL = (address: string) =>
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${PUBLIC_MAPBOX}`;

	if (!address.match(/^http/)) {
		const req = await (
			await fetch(locationURL(address), { method: 'GET' })
		).json();
		return {...e, lnglat: req.features[0].center as LngLatLike }
	} else {
		return {...e, lnglat:[-90.071533, 29.951065] as LngLatLike }
	}



};
