<script lang="ts">
	import { Heading, P, Button } from 'flowbite-svelte';
	import { Slack, Github, Discord } from 'svelte-simples';
</script>

<div class="border p-3 rounded-lg flex">
	<div class="w-3/4 m-4 self-end">
		<Heading class="float-end">We find tech events and bring them to you.</Heading>
		<P class="my-3"
			>All you need to bring is yourself! Explore a growing community of curious people wanting to
			share ideas and learn from others.</P
		>
		<div class="flex gap-3">
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
</div>
