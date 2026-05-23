import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import EventModel from '$lib/db/models/events.model';
import { getOrganizerScope } from '$lib/server/auth/scope';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin');
	if (locals.user.role !== 'orgAdmin' && locals.user.role !== 'super') {
		throw error(403, 'Organizer admin only');
	}

	const scope = await getOrganizerScope(locals.user);
	const query =
		scope === null
			? { end: { $gte: new Date(Date.now() - 30 * 86400_000) } }
			: { groupSlug: { $in: [...scope] }, end: { $gte: new Date(Date.now() - 30 * 86400_000) } };

	const events = await EventModel.find(query)
		.sort({ start: 1 })
		.select(['_id', 'eventSlug', 'meetupName', 'groupName', 'groupSlug', 'start'])
		.lean<
			{
				_id: { toString(): string };
				eventSlug: string;
				meetupName: string;
				groupName: string;
				groupSlug: string;
				start: Date;
			}[]
		>();

	return {
		user: locals.user,
		events: events.map((e) => ({
			id: e._id.toString(),
			eventSlug: e.eventSlug,
			meetupName: e.meetupName,
			groupName: e.groupName,
			start: e.start
		})),
		scopeKind: scope === null ? ('all' as const) : ('groups' as const)
	};
};
