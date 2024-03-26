<script lang="ts">
	import { Heading, Label, Button, Textarea } from 'flowbite-svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Nola Devs Survey</Heading>
	<div class="">
		<form>
			<div class="flex flex-col gap-4">
				<div>
					<Label for="q-1" class="mb-2">How did you hear about us?</Label>
					<Textarea id="q-1" placeholder="Your answer" rows="4" required />
				</div>
				<div>
					<Label for="q-2" class="mb-2">Is there anything missing from NolaDevs.org?</Label>
					<Textarea id="q-2" placeholder="Your answer" rows="4" required />
				</div>
				<div>
					<Label for="q-3" class="mb-2"
						>Where else do you look for tech events in New Orleans?</Label
					>
					<Textarea id="q-3" placeholder="Your answer" rows="4" required />
				</div>
				<div>
					<Label for="q-4" class="mb-2"
						>Would you recommend NolaDevs to your friends and colleagues?</Label
					>
					<Textarea id="q-4" placeholder="Your answer" rows="4" required />
				</div>
				<div>
					<Label for="q-5" class="mb-2">What is your favorite or most-used feature?</Label>
					<Textarea id="q-5" placeholder="Your answer" rows="4" required />
				</div>
			</div>
			<Button class="mt-4" type="submit">Submit</Button>
		</form>
	</div>
</div>
