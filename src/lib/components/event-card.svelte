<script lang="ts">
	import { Card, Heading, P, A } from 'flowbite-svelte';
	import type { Event } from '$types';

	export let event: Event;

	const { group, summary, start, end, location } = event;
</script>

<Card class="w-48">
	<Heading tag="h3" customSize="text-xl font-bold">
		{summary}
	</Heading>
	<Heading customSize="xs">
		{group}
	</Heading>

	<P>
		{start.date.slice(0, -6)}
	</P>
	{#if start.time}
		<P>
			{start.time}
		</P>
	{:else}
		<P>
			{end.date}
		</P>
	{/if}
	<P>
		{#if /^(http|https):\/\/[^ "]+$/.test(location)}
			<A href="{location}">Virtual</A>
		{:else}
			{location.split(',')[0]}
		{/if}
	</P>
</Card>
