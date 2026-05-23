import { lucia } from '$lib/server/auth/lucia';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (locals.session) {
		await lucia.invalidateSession(locals.session.id);
	}
	const cookie = lucia.createBlankSessionCookie();
	cookies.set(cookie.name, cookie.value, { path: '/', ...cookie.attributes });
	return new Response(null, { status: 302, headers: { Location: '/' } });
};
