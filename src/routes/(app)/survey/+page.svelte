<script lang="ts">
	import { Heading, Label, Button, Textarea, P, Select, Radio } from 'flowbite-svelte';

	const heard_from = [
		{ value: 'google', name: 'Google' },
		{ value: 'word-of-mouth', name: 'Word of Mouth' },
		{ value: 'meetup', name: 'Meetup' }
	];
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Nola Devs Survey</Heading>

	<P
		>Help us make improvements to provide quality content and support our community growth. Your
		feedback matters—make it brutal if necessary!</P
	>

	<div class="">
		<form>
			<div class="flex flex-col gap-4">
				<div>
					<Label class="mb-2"
						>How did you hear about us?
						<Select items="{heard_from}" />
					</Label>
				</div>
				<div>
					<Label class="mb-2">
						Were you able to find what you were looking for?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">Yes</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">No</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">I'm still looking</Radio></li>
						</ul>
					</Label>
				</div>
				<div>
					<Label class="mb-2">
						Are there any features or content you would want to see?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">Blog Posts</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Live Streaming</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Resource Center</Radio></li>
						</ul>
					</Label>
				</div>
				<div>
					<Label class="mb-2">
						How easy was it for you to navigate our site?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">Very Easy</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Somewhat Easy</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Neutral</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Somewhat Difficult</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Very Difficult</Radio></li>
						</ul>
					</Label>
				</div>

				<div>
					<Label class="mb-2">
						How likely are you to recommend this site to your friends and colleagues?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">Very Likely</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Somewhat Likely</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Neutral</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Somewhat Unlikely</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Very Unlikely</Radio></li>
						</ul>
					</Label>
				</div>
				<div>
					<Label class="mb-2">
						How was your overall experience?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">😍</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">😃</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">😐</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">☹</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">😢</Radio></li>
						</ul>
					</Label>
				</div>
				<div>
					<Label class="mb-2">
						Were you able to find what you were looking for?
						<ul
							class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
						>
							<li class="w-full"><Radio name="hor-list" class="p-3">Svelte</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Vue JS</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">React</Radio></li>
							<li class="w-full"><Radio name="hor-list" class="p-3">Angular</Radio></li>
						</ul>
					</Label>
				</div>
				<div>
					<Label for="q-5" class="mb-2">Give it to us—how’d we do?</Label>
					<Textarea id="q-5" placeholder="Your answer" rows="4" required />
				</div>
			</div>
			<Button class="mt-4" type="submit">Submit</Button>
		</form>
	</div>
</div>
