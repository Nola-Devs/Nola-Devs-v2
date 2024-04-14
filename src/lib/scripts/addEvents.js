import events from './data/events.json' assert { type: 'json' };
import EventModel from '$lib/db/models/events.model';

export const loadEvents = async () => {
	const res = await EventModel.bulkSave(events.map((e) => new EventModel(e)));
	console.log(res);
};
