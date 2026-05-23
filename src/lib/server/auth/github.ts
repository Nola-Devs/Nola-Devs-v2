import { GitHub } from 'arctic';
import { env } from '$env/dynamic/private';

const clientId = env.GITHUB_CLIENT_ID?.trim();
const clientSecret = env.GITHUB_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
	throw new Error(
		'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET. ' +
			'See .env.example for setup instructions.'
	);
}

export const github = new GitHub(clientId, clientSecret, null);
