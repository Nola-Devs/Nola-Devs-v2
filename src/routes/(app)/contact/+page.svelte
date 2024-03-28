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
</div>
