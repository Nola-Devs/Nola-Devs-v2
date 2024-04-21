<script lang="ts">
	import Icon from '$lib/components/icon/index.svelte';
	import { P, A, Heading, Input, Label, Button, Textarea, Modal } from 'flowbite-svelte';

	let formModal = false;
</script>

<button
	class="inline-flex gap-2.5 px-3 py-1 text-violet-500 border border-violet-500 rounded-lg hover:text-white hover:bg-violet-500 transition-colors text-sm font-medium items-center"
	on:click="{() => (formModal = true)}"
>
	Submit an Event
	<Icon name="plusIcon" size="{20}" />
</button>

<Modal title="Event Submission" bind:open="{formModal}" size="md" outsideclose autoclose>
	<form>
		<Heading class="my-2" tag="h4">Organizer Information</Heading>
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
		<Heading class="my-2" tag="h4">Event Information</Heading>
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
			<Textarea
				id="event_description"
				name="event_description"
				rows="4"
				placeholder="A community for Developers of all levels and backgrounds in the New Orleans Greater Area"
				required
			/>
		</div>

		<P class="text-gray-500 dark:text-gray-400 my-2">
			Your event will be manually reviewed by an administrator before being added to the site.
		</P>

		<P class="text-gray-500 dark:text-gray-400 my-2"
			>If you host frequent events, please <A href="/contact">contact us</A> so that we can set you up
			an organization and give you easier access.
		</P>

		<Button class="mt-4" type="submit">Submit event</Button>
	</form>
</Modal>
