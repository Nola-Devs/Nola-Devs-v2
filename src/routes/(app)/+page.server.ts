import { error } from '@sveltejs/kit';

import { eventController } from '$lib/db/controllers/event.controller';

import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/types/event.d.ts';

export const load: PageServerLoad = async () => {
	try {
		const events: Event[] = (await eventController.getEvents()).sort(
			(a, b) => a.start.getTime() - b.start.getTime()
		);

		return {
			events
		};
	} catch {
		throw error(404, 'Group Not Found');
	}
};

export const actions = {
	submitEvent: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
		console.log('test');
		/**
		 * await fetch(webHookURL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: "Event Bot",
			// the avatar to be displayed
			// avatar_url: "https://sgpoppers.com/wp-content/uploads/2018/05/originalrush.png",
			//content: "@all @everyone",
			embeds: [
				{
					color: 11730954,
					fields: [
						{
							name: "Email",
							value: data.email
						},
						{
							name: "Name",
							value: data.name
						},
						{
							name: "Organization",
							value: data.organization
						},
						{
							name: "Event",
							value: data.event
						},
						{
							name: "Location",
							value: data.location
						},
						{
							name: "Link",
							value: data.link
						},
						{
							name: "Date",
							value: data.date
						},
						{
							name: "Time Start",
							value: data.startTime
						},
						{
							name: "Time End",
							value: data.endTime
						},
						{
							name: "Description",
							value: data.description
						}
					]
				}
			]
		})
	});

	return NextResponse.json("sent", {
		status: 200
	});
		 */
		return { success: true };
	}
} satisfies Actions;
