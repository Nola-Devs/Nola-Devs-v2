import { start_db } from '$lib/db/db';
import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from '@auth/sveltekit/providers/credentials'


// starting up up the DB
start_db()
	.then(() => console.log('DB Started'))
	.catch((e) => console.log(e));


export const handle = SvelteKitAuth({
	providers: [
		Credentials({
			credentials: {
				username: { label: "Username" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, request) {
				const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			}
		})
	],
})