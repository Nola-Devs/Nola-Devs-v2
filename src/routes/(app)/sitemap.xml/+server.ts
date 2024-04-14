// TODO: Add sitemap generation using DB
import type { RequestHandler } from './$types';
import GroupModel from '$lib/db/models/groups.model';
export const GET: RequestHandler = async () => {
	const groups: string[] = await GroupModel.distinct('group');
	const baseAddress = 'https://www.noladevs.org/';

	// TODO: Add EVENTS (prority .7), ABOUT (prority .9) AND CONTACT(prority .9) PAGES
	return new Response(
		`
		<urlset>
		<url>
			<loc>${baseAddress}</loc>
			<lastmod>${new Date().toISOString()}</lastmod>
			<priority>1.00</priority>
		</url>
		${
			// Groups
			groups
				.map(
					(group) => `
				<url>
					<loc>${baseAddress}/groups/${group.replace(/ /g, '-')}</loc>
					<lastmod>${new Date().toISOString()}</lastmod>
					<priority>0.80</priority>
				</url>
			`
				)
				.join('')
		}
		</urlset>
		`,
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
};
