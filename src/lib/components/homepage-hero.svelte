<script lang="ts">
	import { Heading, P, Button, A } from 'flowbite-svelte';
	import { Slack } from 'svelte-simples';
</script>

<div class="p-5 w-full">
	<Heading class="float-end  text-primary-800 dark:text-primary-50">
		Connecting the New Orleans Tech Community
	</Heading>
	<P class="my-3 text-wrap font-thin  text-primary-900 dark:text-primary-50">
		All you need to bring is yourself! Explore a growing community of curious people wanting to
		share ideas and learn from others.
	</P>

	<A href="https://join.slack.com/t/nola/shared_invite/zt-256vzyuvo-1KC88G~MLCT8KCgw4QL7zg">
		<Button class="flex gap-2 bg-violet-200">
			<Slack class="fill-primary-800 dark:fill-primary-100" />
			<P class="text-primary-800 dark:text-primary-100">Join the Conversation</P>
		</Button>
	</A>
</div>
