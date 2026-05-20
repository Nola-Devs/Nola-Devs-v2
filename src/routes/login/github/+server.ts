import { generateState } from 'arctic';
import { dev } from '$app/environment';
import { github } from '$lib/server/auth/github';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const url = github.createAuthorizationURL(state, ['user:email']);

	cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: { Location: url.toString() }
	});
};
