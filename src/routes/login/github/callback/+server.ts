import { OAuth2RequestError } from 'arctic';
import { github } from '$lib/server/auth/github';
import { lucia } from '$lib/server/auth/lucia';
import UserModel from '$lib/db/models/users.model';
import type { RequestHandler } from './$types';

interface GitHubUser {
	id: number;
	login: string;
	name: string | null;
	avatar_url: string;
	email: string | null;
}

interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state');

	if (!code || !state || !storedState || state !== storedState) {
		return new Response('Invalid OAuth state', { status: 400 });
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const accessToken = tokens.accessToken();

		const ghUserRes = await fetch('https://api.github.com/user', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		const ghUser: GitHubUser = await ghUserRes.json();

		let email = ghUser.email;
		if (!email) {
			const emailsRes = await fetch('https://api.github.com/user/emails', {
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			const emails: GitHubEmail[] = await emailsRes.json();
			const primary = emails.find((e) => e.primary && e.verified);
			email = primary?.email ?? null;
		}

		if (!email) {
			return new Response('No verified email on GitHub account', { status: 400 });
		}

		let user = await UserModel.findOne({ githubId: ghUser.id });
		if (!user) {
			const existingUserCount = await UserModel.countDocuments({ githubId: { $exists: true } });
			const role = existingUserCount === 0 ? 'super' : 'member';
			user = await UserModel.create({
				githubId: ghUser.id,
				email,
				name: ghUser.name ?? ghUser.login,
				avatarUrl: ghUser.avatar_url,
				role,
				groupIds: []
			});
		}

		const session = await lucia.createSession(user._id.toString(), {});
		const cookie = lucia.createSessionCookie(session.id);
		cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });

		return new Response(null, {
			status: 302,
			headers: { Location: '/admin' }
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			return new Response('OAuth error', { status: 400 });
		}
		console.error('OAuth callback error:', e);
		return new Response('Internal error', { status: 500 });
	}
};
