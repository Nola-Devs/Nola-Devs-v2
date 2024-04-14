import connectDB from '$lib/db/connection';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	await connectDB();
	return resolve(event);
};
