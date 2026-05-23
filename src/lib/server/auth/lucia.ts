import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { MongooseAdapter } from './mongoose-adapter';
import type { UserRole } from '$lib/types/user';

export const lucia = new Lucia(new MongooseAdapter(), {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attrs) => ({
		githubId: attrs.githubId,
		email: attrs.email,
		name: attrs.name,
		avatarUrl: attrs.avatarUrl,
		role: attrs.role,
		groupIds: attrs.groupIds
	})
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			githubId?: number;
			email: string;
			name?: string;
			avatarUrl?: string;
			role: UserRole;
			groupIds: string[];
		};
	}
}
