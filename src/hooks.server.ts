import type { Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth/lucia';
import connectDB from '$lib/db/connection';
import { seedSharedVendors } from '$lib/server/seed-vendors';

export const handle: Handle = async ({ event, resolve }) => {
	await connectDB();
	await seedSharedVendors();

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const cookie = lucia.createSessionCookie(session.id);
		event.cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });
	}
	if (!session) {
		const cookie = lucia.createBlankSessionCookie();
		event.cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
