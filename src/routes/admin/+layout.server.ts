import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		if (url.pathname === '/admin' || url.pathname === '/admin/') {
			return { user: null };
		}
		throw redirect(302, '/admin');
	}
	if (locals.user.role === 'member') {
		throw redirect(302, '/');
	}
	return { user: locals.user };
};
