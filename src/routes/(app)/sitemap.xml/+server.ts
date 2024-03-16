// TODO: Add sitemap generation using DB
import type { RequestHandler } from './$types';
import GroupModel from '$lib/db/groups';
export const GET: RequestHandler = async () => {
	const groups: string[] = await GroupModel.distinct('group');

	return new Response(
		`
		<urlset>
		<url>
			<loc>https://www.noladevs.org/</loc>
			<lastmod>${new Date().toISOString()}</lastmod>
			<priority>1.00</priority>
		</url>
		${
			groups.map(group => (`
				<url>
					<loc>https://www.noladevs.org/groups/${group.replace(/ /g, '-')}</loc>
					<lastmod>${new Date().toISOString()}</lastmod>
					<priority>0.80</priority>
				</url>
			`)).join('')
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
