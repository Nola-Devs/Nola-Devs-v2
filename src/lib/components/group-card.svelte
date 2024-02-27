<script lang="ts">
	import IconParser from './icon-parser.svelte';
	import { P, A, Heading, Button } from 'flowbite-svelte';
	import type { Group } from '$types';

	import { CalendarPlusSolid } from 'flowbite-svelte-icons';

	export let group: Group;
	$: group;

	const copy = () => {
		navigator.clipboard.writeText(group.calID);
	};
</script>

<div class="card">
	<div class="">
		<Heading tag="h2">
			{group?.group}
		</Heading>

		<div class="flex gap-3">
			{#each Object.entries(group?.links) as [site, link] (site)}
				<A href="{link}" target="_blank" class="flex items-center justify-center p-1 px-2 ">
					<IconParser styles="{'my-auto'}" icon="{site}" size="{20}" />
				</A>
			{/each}
		</div>

		<P>
			{group?.about}
		</P>

		<div class="card-links">
			<Button class="my-3 flex gap-3" on:click="{copy}">
				<CalendarPlusSolid class="text-color dark:text-white" />
				<P>Subscribe</P>
			</Button>
		</div>
	</div>
</div>
