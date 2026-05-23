import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import EventModel from '$lib/db/models/events.model';
import { vendorController } from '$lib/db/controllers/vendor.controller';
import { rsvpController } from '$lib/db/controllers/rsvp.controller';
import { calculatePizza, computeOrderByAt } from '$lib/utils/pizza-math';
import { assertOrganizerForGroupSlug } from '$lib/server/auth/scope';

const DEFAULT_BUFFER = 1.2;
const DEFAULT_SLICES_PER_PERSON = 2.5;
const DEFAULT_SLICES_PER_PIE = 8;
const DEFAULT_LEAD_TIME_HOURS = 4;

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(302, '/admin');

	const event = await EventModel.findOne({ eventSlug: params.eventID }).lean<{
		_id: { toString(): string };
		meetupName: string;
		groupName: string;
		groupSlug: string;
		start: Date;
		end: Date;
		pizza?: {
			vendorId?: { toString(): string };
			slicesPerPerson?: number;
			slicesPerPie?: number;
			leadTimeHours?: number;
			bufferMultiplier?: number;
		};
	}>();
	if (!event) throw error(404, 'Event not found');

	await assertOrganizerForGroupSlug(locals.user, event.groupSlug);

	const vendors = await vendorController.list();
	const summary = await rsvpController.summaryByEventId(event._id.toString());
	const rsvps = await rsvpController.listByEventId(event._id.toString());

	const vendorId = event.pizza?.vendorId?.toString();
	const vendor = vendorId ? vendors.find((v) => v._id === vendorId) : undefined;

	const slicesPerPerson =
		event.pizza?.slicesPerPerson ?? vendor?.defaultSlicesPerPerson ?? DEFAULT_SLICES_PER_PERSON;
	const slicesPerPie =
		event.pizza?.slicesPerPie ?? vendor?.defaultSlicesPerPie ?? DEFAULT_SLICES_PER_PIE;
	const leadTimeHours =
		event.pizza?.leadTimeHours ?? vendor?.defaultLeadTimeHours ?? DEFAULT_LEAD_TIME_HOURS;
	const bufferMultiplier = event.pizza?.bufferMultiplier ?? DEFAULT_BUFFER;

	const calc = calculatePizza({
		totalHeadcount: summary.totalHeadcount,
		totalSlices: summary.totalSlices,
		slicesPerPerson,
		slicesPerPie,
		bufferMultiplier
	});
	const orderByAt = computeOrderByAt(new Date(event.start), leadTimeHours);

	return {
		event: {
			id: event._id.toString(),
			eventSlug: params.eventID,
			meetupName: event.meetupName,
			groupName: event.groupName,
			start: event.start,
			end: event.end
		},
		vendors,
		config: {
			vendorId: vendorId ?? null,
			slicesPerPerson,
			slicesPerPie,
			leadTimeHours,
			bufferMultiplier
		},
		summary,
		calc,
		orderByAt,
		rsvps
	};
};

export const actions: Actions = {
	saveConfig: async ({ params, request, locals }) => {
		if (!locals.user) return fail(401);
		const event = await EventModel.findOne({ eventSlug: params.eventID })
			.select(['_id', 'groupSlug'])
			.lean<{ _id: { toString(): string }; groupSlug: string }>();
		if (!event) return fail(404);
		await assertOrganizerForGroupSlug(locals.user, event.groupSlug);

		const form = await request.formData();
		const vendorId = (form.get('vendorId') as string) || null;
		const slicesPerPerson = Number(form.get('slicesPerPerson'));
		const slicesPerPie = Number(form.get('slicesPerPie'));
		const leadTimeHours = Number(form.get('leadTimeHours'));
		const bufferMultiplier = Number(form.get('bufferMultiplier'));

		const ranges: Array<[number, number, number, string]> = [
			[slicesPerPerson, 0.5, 10, 'slicesPerPerson'],
			[slicesPerPie, 1, 24, 'slicesPerPie'],
			[leadTimeHours, 0, 168, 'leadTimeHours'],
			[bufferMultiplier, 1, 3, 'bufferMultiplier']
		];
		for (const [v, min, max, name] of ranges) {
			if (!Number.isFinite(v) || v < min || v > max) {
				return fail(400, { error: `${name} must be between ${min} and ${max}` });
			}
		}

		await EventModel.updateOne(
			{ _id: event._id },
			{
				$set: {
					'pizza.vendorId': vendorId || undefined,
					'pizza.slicesPerPerson': slicesPerPerson,
					'pizza.slicesPerPie': slicesPerPie,
					'pizza.leadTimeHours': leadTimeHours,
					'pizza.bufferMultiplier': bufferMultiplier
				}
			}
		);
		return { ok: true };
	}
};
