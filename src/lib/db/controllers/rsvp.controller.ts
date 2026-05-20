import { randomBytes } from 'node:crypto';
import { error } from '@sveltejs/kit';
import RsvpModel, { RSVP_HEADCOUNT_MAX, RSVP_SLICES_MAX } from '../models/rsvps.model';
import EventModel from '../models/events.model';

interface RsvpInput {
	email: string;
	name?: string;
	headcount: number;
	slices: number;
}

interface RsvpSummary {
	totalRsvps: number;
	totalHeadcount: number;
	totalSlices: number;
}

const EXPIRES_AFTER_EVENT_DAYS = 30;

function normalizeInput(input: RsvpInput) {
	const email = input.email?.trim().toLowerCase();
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw error(400, 'Valid email required');
	}
	const headcount = Math.floor(Number(input.headcount));
	const slices = Math.floor(Number(input.slices));
	if (!Number.isFinite(headcount) || headcount < 1 || headcount > RSVP_HEADCOUNT_MAX) {
		throw error(400, `Headcount must be 1–${RSVP_HEADCOUNT_MAX}`);
	}
	if (!Number.isFinite(slices) || slices < 0 || slices > RSVP_SLICES_MAX) {
		throw error(400, `Slices must be 0–${RSVP_SLICES_MAX}`);
	}
	const name = input.name?.trim() || undefined;
	return { email, name, headcount, slices };
}

export const rsvpController = {
	upsert: async (eventSlug: string, input: RsvpInput) => {
		const normalized = normalizeInput(input);
		const event = await EventModel.findOne({ eventSlug }).select(['_id', 'end']).lean<{
			_id: { toString(): string };
			end: Date;
		}>();
		if (!event) throw error(404, 'Event not found');

		const expiresAt = new Date(event.end.getTime() + EXPIRES_AFTER_EVENT_DAYS * 86400_000);
		const editToken = randomBytes(24).toString('hex');

		const existing = await RsvpModel.findOne({ eventId: event._id, email: normalized.email });
		if (existing) {
			existing.name = normalized.name;
			existing.headcount = normalized.headcount;
			existing.slices = normalized.slices;
			existing.updatedAt = new Date();
			existing.expiresAt = expiresAt;
			await existing.save();
			return { editToken: existing.editToken, updated: true };
		}

		await RsvpModel.create({
			eventId: event._id,
			email: normalized.email,
			name: normalized.name,
			headcount: normalized.headcount,
			slices: normalized.slices,
			editToken,
			expiresAt
		});
		return { editToken, updated: false };
	},

	updateByToken: async (eventSlug: string, token: string, input: RsvpInput) => {
		const normalized = normalizeInput(input);
		const event = await EventModel.findOne({ eventSlug }).select(['_id']).lean<{
			_id: { toString(): string };
		}>();
		if (!event) throw error(404, 'Event not found');

		const rsvp = await RsvpModel.findOne({ eventId: event._id, editToken: token });
		if (!rsvp) throw error(404, 'RSVP not found');

		rsvp.name = normalized.name;
		rsvp.headcount = normalized.headcount;
		rsvp.slices = normalized.slices;
		rsvp.updatedAt = new Date();
		await rsvp.save();
		return { ok: true };
	},

	deleteByToken: async (eventSlug: string, token: string) => {
		const event = await EventModel.findOne({ eventSlug }).select(['_id']).lean<{
			_id: { toString(): string };
		}>();
		if (!event) throw error(404, 'Event not found');
		await RsvpModel.deleteOne({ eventId: event._id, editToken: token });
		return { ok: true };
	},

	summaryByEventId: async (eventId: string): Promise<RsvpSummary> => {
		const agg = await RsvpModel.aggregate<{
			_id: null;
			totalRsvps: number;
			totalHeadcount: number;
			totalSlices: number;
		}>([
			{ $match: { eventId: new RsvpModel.base.Types.ObjectId(eventId) } },
			{
				$group: {
					_id: null,
					totalRsvps: { $sum: 1 },
					totalHeadcount: { $sum: '$headcount' },
					totalSlices: { $sum: '$slices' }
				}
			}
		]);
		return agg[0]
			? {
					totalRsvps: agg[0].totalRsvps,
					totalHeadcount: agg[0].totalHeadcount,
					totalSlices: agg[0].totalSlices
				}
			: { totalRsvps: 0, totalHeadcount: 0, totalSlices: 0 };
	},

	summaryByEventSlug: async (eventSlug: string): Promise<RsvpSummary> => {
		const event = await EventModel.findOne({ eventSlug }).select(['_id', 'rsvpStats']).lean<{
			_id: { toString(): string };
			rsvpStats?: { totalRsvps: number; totalHeadcount: number; totalSlices: number };
		}>();
		if (!event) return { totalRsvps: 0, totalHeadcount: 0, totalSlices: 0 };
		if (event.rsvpStats) {
			return {
				totalRsvps: event.rsvpStats.totalRsvps,
				totalHeadcount: event.rsvpStats.totalHeadcount,
				totalSlices: event.rsvpStats.totalSlices
			};
		}
		return rsvpController.summaryByEventId(event._id.toString());
	},

	finalizeStats: async (eventId: string) => {
		const summary = await rsvpController.summaryByEventId(eventId);
		await EventModel.updateOne(
			{ _id: eventId },
			{
				$set: {
					rsvpStats: {
						totalRsvps: summary.totalRsvps,
						totalHeadcount: summary.totalHeadcount,
						totalSlices: summary.totalSlices,
						finalizedAt: new Date()
					}
				}
			}
		);
		return summary;
	},

	finalizeExpiredEvents: async () => {
		const cutoff = new Date();
		const events = await EventModel.find({
			end: { $lt: cutoff },
			$or: [{ rsvpStats: { $exists: false } }, { 'rsvpStats.finalizedAt': { $exists: false } }]
		})
			.select(['_id'])
			.lean<{ _id: { toString(): string } }[]>();

		let finalized = 0;
		for (const e of events) {
			await rsvpController.finalizeStats(e._id.toString());
			finalized++;
		}
		return { finalized };
	},

	listByEventId: async (eventId: string) => {
		const docs = await RsvpModel.find({ eventId })
			.sort({ createdAt: 1 })
			.lean<
				{
					_id: { toString(): string };
					email: string;
					name?: string;
					headcount: number;
					slices: number;
					createdAt: Date;
					updatedAt: Date;
				}[]
			>();
		return docs.map((d) => ({
			id: d._id.toString(),
			email: d.email,
			name: d.name,
			headcount: d.headcount,
			slices: d.slices,
			createdAt: d.createdAt,
			updatedAt: d.updatedAt
		}));
	}
};
