import type { RequestHandler } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
export const GET: RequestHandler = async () => {
	const groups: string[] = await GroupModel.distinct('group');
	// TODO add EVENTS into allow
	return new Response(
		`User-agent: *
Disallow: /admin/

${groups.map((group) => `Allow: /groups/${group.replace(/ /g, '-')}\n`).join('')}

Sitemap: https://www.noladevs.org/sitemap.xml`,
		{
			headers: {
				'Content-Type': 'text/plain'
			}
		}
	);
};
