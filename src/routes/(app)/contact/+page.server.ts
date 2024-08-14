import type { Action, RequestEvent } from './$types';
import { DISCORD } from '$env/static/private';

export const actions: Action = {
	sendMsg: async (event: RequestEvent) => {
		// Parse the form data
		const data = await event.request.formData();
		const email = data.get('email');
		const message = data.get('message');

		// Send the request
		const bodyContents = {
			content: `New email!\n**From**: ${email}\n**Message**:\n${message}`,
			username: "You've got mail!"
		};
		const body = JSON.stringify(bodyContents);
		try {
			const resp = await fetch(`${DISCORD}?wait=true`, {
				method: 'POST',
				body,
				headers: {
					'Content-Type': 'application/json'
				}
			});
			let status = resp.status;
			let resp_body = await resp?.json();
			if (status != 200) {
				console.error(`Error sending message to admins, status code ${status}`, resp_body);
			}
		} catch (error) {
			console.error('Error sending message to admins:', error);
		}
	}
};
