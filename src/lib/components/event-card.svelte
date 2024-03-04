<script lang="ts">
	import Map from './map.svelte';
	import { Card, Heading, P, A, Img } from 'flowbite-svelte';
	import type { Event } from '$types';

	export let event: Event;

	const { group, summary, start, end, location } = event;
</script>

<Card padding="none" class="bg-primary-100 dark:bg-primary-800">
	<div class="w-full h-full p-3 grid grid-rows-4">
		<Heading tag="h4" customSize="text-2xl" class="font-extrabold">
			{summary}
		</Heading>
		<Heading tag="h5" customSize="lg" class="font-bold">
			{group}
		</Heading>
		<P class="font-extralight text-sm">
			{#if /^(http|https):\/\/[^ "]+$/.test(location)}
				<A href="{location}">Virtual</A>
			{:else}
				<P>
					{location.split(',')[0]}
				</P>
			{/if}
		</P>

		<P class="font-extralight text-sm">
			{start.date.slice(0, -6)}
		</P>
		<P class="font-extralight  text-sm">
			{#if start.time}
				{start.time}
			{:else}
				{end.date}
			{/if}
		</P>
	</div>
</Card>
