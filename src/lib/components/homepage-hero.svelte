<script lang="ts">
	import { Heading, P, Button } from 'flowbite-svelte';
	import { Slack, Github, Discord } from 'svelte-simples';
</script>

<div class="p-5 w-full">
	<Heading class="float-end">We find tech events and bring them to you.</Heading>
	<P class="my-3 text-wrap font-thin"
		>All you need to bring is yourself! Explore a growing community of curious people wanting to
		share ideas and learn from others.
	</P>
	<div class="flex gap-3 w-full justify-center">
		<Button class="flex gap-2 w-32">
			<Slack class="fill-inherit dark:fill-white" />
			<P>Slack</P>
		</Button>

		<Button class="flex gap-2 w-32">
			<Discord class="fill-inherit dark:fill-white" />
			<P>Discord</P>
		</Button>
		<Button class="flex gap-2 w-32">
			<Github class="fill-inherit dark:fill-white" />
			<P>Github</P>
		</Button>
	</div>
</div>
