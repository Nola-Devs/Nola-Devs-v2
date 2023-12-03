<script lang="ts">
	import type { PageData } from './$types';
	import type { Event, Group } from '$appTypes';

	import Carousel from '../../components/carousel.svelte';
	import { EventCard, GroupCard } from '$components';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data: PageData;

	$: group = data.groupObj.group as string;
	$: events = data.events as Event[];

	if (events) {
		events.forEach((e) => {
			if (
				e.start.date ===
				new Intl.DateTimeFormat('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				}).format(new Date(e.start.date))
			) {
				toast('There Is Something Happening Today!', { icon: '❗️' });
			}
		});
	}
</script>

<svelte:head>
	<title>NOLA Devs:{group}</title>
	<meta name="description" content="{data.groupObj.about}" />
</svelte:head>

<div class="group">
	<div class="section">
		<div class="groupCard">
			<GroupCard groupName="{group}" />
		</div>
		<div class="carousel">
			<Carousel />
		</div>
	</div>

	{#if events !== undefined}
		<div class="event-list">
			{#key events}
				{#each events as e}
					<EventCard event="{e}" />
				{/each}
			{/key}
		</div>
	{/if}
</div>
<Toaster />

<style>
	.event-list {
		scroll-behavior: smooth;
		overflow-y: auto;
		border-radius: 10px;
		clip-path: fill-box;
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 3px;
		scroll-snap-type: y mandatory;
	}

	.groupCard,
	.carousel {
		scroll-snap-align: start;
		height: 100%;
	}

	.section {
		overflow: auto;
		scroll-snap-type: y mandatory;
		display: grid;
		clip-path: fill-box;
		border-radius: 10px;
		grid-template-rows: [first] 100% [line2] auto;
	}

	.group {
		height: 100vh;
		padding: 5px;
		display: grid;
		grid-template-rows: [first] 40% [line2] auto;
		gap: 3px;
	}
</style>
