import { createEvent } from 'ics';
import type { Event } from '$lib/types/event.d.ts';

export const ics = (event: Event) => {
	downloadICS(event);
};

async function downloadICS(event: Event) {
	const { summary, description, start, end, location, lnglat, group, calLink } = event;
	const startDate: any = start.getTime();
	const endDate: any = end.getTime();
	const geo = { lat: lnglat[1], lon: lnglat[0] };
	let filename = summary + '.ics';

	const icsEvent = {
		start: startDate,
		end: endDate,
		title: summary,
		description: `${group} /n ${description}`,
		location: location,
		geo: geo
	};

	let file: File;

	file = await new Promise((resolve, reject) => {
		createEvent(icsEvent, (error, value) => {
			if (error) {
				reject(error);
			}
			resolve(new File([value], filename, { type: 'text/calendar' }));
		});
	});

	const url = URL.createObjectURL(file);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;

	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);

	URL.revokeObjectURL(url);
}
