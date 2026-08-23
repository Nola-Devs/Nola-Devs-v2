/**
 * Dates for noladevs events.
 *
 * Every event is a New Orleans event, so the calendar date one falls on is the
 * local date — not the server's, and not UTC. On a UTC host those differ for
 * anything happening after 6pm, which is most meetups.
 */

/**
 * The zone every event date is read and shown in.
 */
export const EVENT_TIME_ZONE = 'America/Chicago';

/**
 * How far behind UTC a zone is at a given instant, in milliseconds. Both sides
 * are parsed in the server's own zone, so that offset cancels and only the
 * target zone's is left — daylight saving included, since it is read off the
 * instant rather than assumed.
 */
export const zoneOffsetMs = (date: Date, timeZone: string) =>
	new Date(date.toLocaleString('en-US', { timeZone: 'UTC' })).getTime() -
	new Date(date.toLocaleString('en-US', { timeZone })).getTime();

/**
 * The calendar date an instant falls on in New Orleans.
 */
export const eventDateParts = (date: Date) => {
	const [month, day, year] = new Intl.DateTimeFormat('en-US', {
		timeZone: EVENT_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	})
		.format(date)
		.split('/')
		.map(Number);

	return { year, month, day };
};

/**
 * `03112026`, the date portion of an `eventSlug`.
 */
export const formatDateForSlug = (date: Date) => {
	const { year, month, day } = eventDateParts(date);

	return `${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${year}`;
};
