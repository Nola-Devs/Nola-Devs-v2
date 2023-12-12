import { PUBLIC_MAPBOX } from '$env/static/public';
import type { LngLat } from 'mapbox-gl';

export const RevGeocode = async (address: string): Promise<LngLat> => {
	const businessAndAddressRegex =
		/\b\d+\s+[a-zA-Z0-9\s.,-]+,\s*[a-zA-Z\s]+\s*,\s*[a-zA-Z]+\s*\d{5}(?:-\d{4})?\s*,\s*[a-zA-Z]+\b/;
	const parsedAddress: string | null = address.match(businessAndAddressRegex) as string | null;

	const locationURL = (address: string, type: string) =>
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?types=${type}&access_token=${PUBLIC_MAPBOX}`;

	if (parsedAddress !== null) {
		let req = await (await fetch(locationURL(parsedAddress, 'address'), { method: 'GET' })).json();
		return req.features[0].center as LngLat;
	} else if (!address.match(/^http/)) {
		let req = await (await fetch(locationURL(address, 'poi'), { method: 'GET' })).json();
		if (req.features[0].center[0] !== -90.071533) {
			return req.features[0].center as LngLat;
		}
	}

	return [-90.071533, 29.951065] as unknown as LngLat;
};
