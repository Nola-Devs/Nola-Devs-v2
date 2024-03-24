import { CAL } from '$env/static/private';
import type { Group } from '$lib/types/group.d.ts';
import type { googleCalAPIType } from '$lib/types/google-api.d.ts';

export const googleCalAPICall = async (groupDetails: Group): Promise<googleCalAPIType[]> => {
	// This is the amount of days from today for API
	const { calID, group: groupName } = groupDetails;

	const days = 30;

	const start = new Date();
	const end = new Date(start.getTime() + days * 86400000);

	const timeFrame = `timeMax=${end.toISOString()}&timeMin=${start.toISOString()}`;
	const auth = `key=${CAL}`;
	const queryParams = `singleEvents=true&showDeleted=false&orderBy=startTime`;

	try {
		const response = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/${calID}/events?${timeFrame}&${queryParams}&${auth}`,
			{ method: 'GET' }
		);
		if (!response.ok) throw new Error('Failed to fetch from Google Calendar API');

		const data = await response.json();
		const namedEvents = (data.items || []).map((event: googleCalAPIType) => ({
			...event,
			group: groupName
		}));
		return namedEvents;
	} catch (e) {
		console.error('Error fetching Google Calendar events:', e);
		return [];
	}
};
