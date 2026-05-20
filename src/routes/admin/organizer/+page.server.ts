import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin');
	if (locals.user.role !== 'orgAdmin' && locals.user.role !== 'super') {
		throw error(403, 'Organizer admin only');
	}
	return { user: locals.user };
};
