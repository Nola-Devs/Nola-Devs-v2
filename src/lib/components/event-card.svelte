<script lang="ts">
	import Map from './map.svelte';
	import { Card, Heading, P, A, Img } from 'flowbite-svelte';
	import type { Event } from '$types';

	export let event: Event;

	const { group, summary, start, end, location } = event;
</script>

<Card padding="none">
	{#if !/^(http|https):\/\/[^ "]+$/.test(location)}
		<Map location="{event.lnglat}" />
	{:else}
		<Img
			class="w-full h-full rounded-t-lg object-cover"
			src="https://ttgmice.2017.ttgasia.com/wp-content/uploads/sites/3/2020/12/online-event.jpg"
			alt="this is a virtual event"
		/>
	{/if}
	<div class="w-full h-full p-3">
		<Heading tag="h4" customSize="xl" class="font-bold">
			{summary}
		</Heading>
		<Heading tag="h5" customSize="lg">
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
