import { CAL } from '$env/static/private';
import type { Event, Group,googleCalAPIType } from '$types';

export const googleCalAPICall = async (groupcalIDsAndGroupNames: Group): Promise<googleCalAPIType[]> => {
	// This is the amount of days from today for API
	const calID = groupcalIDsAndGroupNames.calID;
	const groupName = groupcalIDsAndGroupNames.group;

	const days = 30;

	const start = new Date();
	const end = new Date();
	end.setTime(end.getTime() + days * 86400000);

	const timeFrame = `timeMax=${end.toISOString()}&timeMin=${start.toISOString()}`;
	const auth = `key=${CAL}`;
	const queryParams = `singleEvents=true&showDeleted=false&orderBy=startTime`;

	const reqToGoogle = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${calID}/events?${timeFrame}&${queryParams}&${auth}`,
		{ method: 'GET' }
	);

	const parseReqToJson = await reqToGoogle.json();
	
	const namedEvents = await parseReqToJson.items.map((e: any)=>({ ...e, group: groupName})) ;

	return namedEvents as googleCalAPIType[]
};
