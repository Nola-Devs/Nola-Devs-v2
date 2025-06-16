import type { PageServerLoad } from './$types';
import { userController } from '$lib/db/controllers/user.controller';

export const load: PageServerLoad = async () => {
	const contributorsList: Promise<any> = (
		await fetch(`https://api.github.com/repos/Nola-Devs/Nola-Devs-v2/contributors`, {
			method: 'GET',
		})
	).json();

	const organizers = await userController.getAllOrganizers();

	return { contributorsList, organizers };
};
