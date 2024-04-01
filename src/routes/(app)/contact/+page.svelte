<script lang="ts">
	import { Heading, P, Input, Label, A, Button, List, Li } from 'flowbite-svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Contact Us</Heading>

	<P
		>Have a question, feedback, or just want to say hey—we’re here to answer any of your inquiries.</P
	>

	<Heading tag="h2">Community-Related</Heading>

	<List
		class="text-base text-gray-900 dark:text-white leading-normal font-normal text-left whitespace-normal"
	>
		<Li>Contact Nola Devs team: <A href="mailto:info@noladevs.org">info@noladevs.org</A></Li>
		<Li>Add your group: <A href="mailto:info@noladevs.org">info@noladevs.org</A></Li>
		<Li>Add an event: <A href="/">Click the "submit an event" button</A>.</Li>
	</List>

	<Heading tag="h2">Support & Feedback</Heading>

	<P
		>Provide feedback about the website, events, and how we can improve the platform to create a
		better experience.</P
	>

	<List
		class="text-base text-gray-900 dark:text-white leading-normal font-normal text-left whitespace-normal"
	>
		<Li>Send an email to <A href="mailto:support@noladevs.org">support@noladevs.org</A></Li>
		<Li>Fill out this <A href="/survey">handy survey</A>!</Li>
		<Li
			><A href="https://github.com/Nola-Devs/Nola-Devs-v2/issues">Submit an issue</A> with your suggestion!</Li
		>
	</List>

	<Heading tag="h2">Sponsor & Promotions</Heading>

	<P>Find out how you can help support the growth of the New Orleans tech community!</P>

	<List
		class="text-base text-gray-900 dark:text-white leading-normal font-normal text-left whitespace-normal"
	>
		<Li>Send an email to <A href="mailto:growth@noladevs.org">growth@noladevs.org</A></Li>
	</List>
</div>
