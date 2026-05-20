import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import SessionModel from '$lib/db/models/sessions.model';
import UserModel from '$lib/db/models/users.model';
import type { UserRole } from '$lib/types/user';

export class MongooseAdapter implements Adapter {
	async getSessionAndUser(
		sessionId: string
	): Promise<[DatabaseSession | null, DatabaseUser | null]> {
		const session = await SessionModel.findById(sessionId).lean<{
			_id: string;
			userId: { toString(): string };
			expiresAt: Date;
		}>();
		if (!session) return [null, null];

		const user = await UserModel.findById(session.userId).lean<{
			_id: { toString(): string };
			githubId?: number;
			email: string;
			name?: string;
			avatarUrl?: string;
			role: string;
			groupIds: { toString(): string }[];
		}>();
		if (!user) return [null, null];

		return [
			{
				id: session._id,
				userId: session.userId.toString(),
				expiresAt: session.expiresAt,
				attributes: {}
			},
			{
				id: user._id.toString(),
				attributes: {
					githubId: user.githubId,
					email: user.email,
					name: user.name,
					avatarUrl: user.avatarUrl,
					role: user.role as UserRole,
					groupIds: (user.groupIds ?? []).map((g) => g.toString())
				}
			}
		];
	}

	async getUserSessions(userId: string): Promise<DatabaseSession[]> {
		const sessions = await SessionModel.find({ userId }).lean<
			{ _id: string; userId: { toString(): string }; expiresAt: Date }[]
		>();
		return sessions.map((s) => ({
			id: s._id,
			userId: s.userId.toString(),
			expiresAt: s.expiresAt,
			attributes: {}
		}));
	}

	async setSession(session: DatabaseSession): Promise<void> {
		await SessionModel.create({
			_id: session.id,
			userId: session.userId,
			expiresAt: session.expiresAt
		});
	}

	async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		await SessionModel.updateOne({ _id: sessionId }, { expiresAt });
	}

	async deleteSession(sessionId: string): Promise<void> {
		await SessionModel.deleteOne({ _id: sessionId });
	}

	async deleteUserSessions(userId: string): Promise<void> {
		await SessionModel.deleteMany({ userId });
	}

	async deleteExpiredSessions(): Promise<void> {
		await SessionModel.deleteMany({ expiresAt: { $lte: new Date() } });
	}
}
