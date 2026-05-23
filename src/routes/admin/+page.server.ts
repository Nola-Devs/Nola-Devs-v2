import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return {};
	if (locals.user.role === 'super') throw redirect(302, '/admin/admin');
	if (locals.user.role === 'orgAdmin') throw redirect(302, '/admin/organizer');
	throw redirect(302, '/');
};
