import type { PageServerLoad } from './$types';
import { GITHUB_SECRET, GITHUB_CLIENT_ID } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const contributorsList: Promise<any> = (
		await fetch(`https://api.github.com/repos/Nola-Devs/Nola-Devs-v2/contributors`, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${GITHUB_CLIENT_ID}:${GITHUB_SECRET}`
			}
		})
	).json();

	return { contributorsList };
};
