<script lang="ts">
	import { Heading, P, Input, Label, A, Button } from 'flowbite-svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Contact Nola Devs</Heading>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div>
			<P>We want to hear from you!</P>

			<P
				>You can either reach us on the form, or email us directly at <A
					href="mailto:contact@noladevs.org">contact@noladevs.org</A
				></P
			>
		</div>
		<form>
			<div class="flex flex-col gap-4">
				<div>
					<Label for="email" class="mb-2">Email address</Label>
					<Input type="email" id="email" placeholder="john.doe@company.com" required />
				</div>
				<div>
					<Label for="message" class="mb-2">Message</Label>
					<Input type="text" id="message" placeholder="Message" required />
				</div>
			</div>
			<Button class="mt-4" type="submit">Submit</Button>
		</form>
	</div>

	<Heading tag="h2">Have an Event?</Heading>

	<form>
		<Heading tag="h3">About you:</Heading>
		<div class="grid gap-6 mb-6 md:grid-cols-3">
			<div>
				<Label for="organizer_name" class="mb-2">Your Name</Label>
				<Input type="text" id="organizer_name" placeholder="John Doe" required />
			</div>
			<div>
				<Label for="email" class="mb-2">Your Email</Label>
				<Input type="email" id="email" placeholder="john_doe@NOLADevs.org" required />
			</div>
			<div>
				<Label for="organization" class="mb-2">Organization</Label>
				<Input type="text" id="organization" placeholder="NOLA Devs" required />
			</div>
		</div>
		<Heading tag="h3">About the Event:</Heading>
		<div class="grid gap-6 mb-6 md:grid-cols-3">
			<div>
				<Label for="event_name" class="mb-2">Event Name</Label>
				<Input type="text" id="event_name" placeholder="Tech Meetup" required />
			</div>
			<div>
				<Label for="location" class="mb-2">Event Location</Label>
				<Input
					type="text"
					id="location"
					placeholder="1751 Gentilly Blvd, New Orleans, LA 70119, United States"
					required
				/>
			</div>
			<div>
				<Label for="website" class="mb-2">Event Website</Label>
				<Input type="url" id="organization" placeholder="https://noladevs.org" required />
			</div>
		</div>
		<div class="grid gap-6 mb-6 md:grid-cols-3">
			<div>
				<Label for="event_date" class="mb-2">Event Date</Label>
				<Input type="date" id="event_date" placeholder="01-01-1970" required />
			</div>
			<div>
				<Label for="event_start" class="mb-2">Event Start</Label>
				<Input type="time" id="event_start" placeholder="6:00 AM" required />
			</div>
			<div>
				<Label for="event_end" class="mb-2">Event End</Label>
				<Input type="time" id="event_end" placeholder="6:00 PM" required />
			</div>
		</div>
		<div>
			<Label for="event_description" class="mb-2">Event Description</Label>
			<Input
				type="text"
				id="event_description"
				placeholder="A community for Developers of all levels and backgrounds in the New Orleans Greater Area"
				required
			/>
		</div>
		<Button class="mt-4" type="submit">Submit event</Button>
	</form>
</div>
