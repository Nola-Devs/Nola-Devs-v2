import connectDB from '$lib/db/db';

export async function handle({ event, resolve }) {
	await connectDB();
	return resolve(event);
}
