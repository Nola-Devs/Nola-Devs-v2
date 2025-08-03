<script lang="ts">
	import { Heading, P, Input, Label, A, Button, Textarea } from 'flowbite-svelte';
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
		<form method="post" action="?/sendMsg" autocomplete="on">
			<div class="flex flex-col gap-4">
				<div>
					<Label for="email" class="mb-2">Email address</Label>
					<Input
						class="bg-primary-100"
						type="email"
						id="email"
						name="email"
						placeholder="john.doe@company.com"
						required
					/>
				</div>
				<div>
					<Label for="message" class="mb-2">Message</Label>
					<Textarea
						type="text"
						rows="5"
						id="message"
						name="message"
						placeholder="Message"
						required
					/>
				</div>
			</div>
			<Button class="mt-4" type="submit">Submit</Button>
		</form>
	</div>
	<Heading tag="h2">Submit an Event</Heading>
	<div>
		<P class="mb-4">
			Currently, all events are aggregated from Google Calendars belonging to established groups.</P
		>
		<P class="mb-4">
			For example: the Below C Level is a group that has a Google Calendar. They add upcoming events
			to their calendar, then once a day from that calendar, we grab all the events that are
			happening in the next 30 days.</P
		>
		<P
			>If you have a new group you want to establish, please leave a message on the #general channel
			in the <A
				href="https://join.slack.com/t/nola/shared_invite/zt-33so6nl8m-qDq5rDFrMnw5eeXcERP7jA"
				>community Slack</A
			> or <A href="https://github.com/Nola-Devs/Nola-Devs-v2/issues">create an issue</A> on the repository
			for the site. We will respond shortly after.</P
		>
	</div>
</div>
