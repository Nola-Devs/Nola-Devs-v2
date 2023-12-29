import type { Actions, PageServerLoad } from './$types';
import { ADMIN_PW } from '$env/static/private';

export const load: PageServerLoad = async ({ params }) => {
	return { test: 'test' };
};

export const actions: Actions = {
	login: async ({ request }) => {
		const pw = await (await request.formData()).get('password');
		if (pw === ADMIN_PW) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
};
