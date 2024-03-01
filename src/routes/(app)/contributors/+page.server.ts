import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const request = await fetch(`https://api.github.com/repos/Nola-Devs/Nola-Devs-v2/contributors`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// print data from the fetch on screen
	const contributorsList: any = await request.json();
	console.log(contributorsList);
	return { contributorsList };
};
