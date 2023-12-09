<script lang="ts">
	//import type { PageData } from './$types';
	import Carousel from '../../components/carousel.svelte';
	import { EventCard, GroupCard } from '$components';
	import type { Group, Event } from '$types';
	import { onMount } from 'svelte';
	import { getGroupsEvents } from '$lib';
	import type { PageData } from './$types';
	import toast, { Toaster } from 'svelte-french-toast';

	import { page } from '$app/stores';

	let slug: string;
	let events: Event[];
	let group: Group;
	let data: any;

	$: slug = $page.params.group.split('=')[1];
	$: events;
	$: group;

	const loadData = async () => {
		data = await getGroupsEvents();
	};

	const handleSlugChange = async (newSlug: string) => {
		events = data.eventsJSON.find((group: any) => group.group === newSlug).events as Event[];
		group = data.groupsJSON.find((group: any) => group.group === newSlug) as Group;
		events.forEach((event: Event) => {
			if (
				event.start.date ===
				new Intl.DateTimeFormat('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				}).format(new Date())
			) {
				toast(`${event.summary} is happening today!!`, { icon: '🎉' });
			}
		});
	};

	onMount(() => {
		loadData();
		handleSlugChange(slug);
		const unsubscribe = page.subscribe((newPage) => {
			const newSlug = newPage.params.group.split('=')[1];
			if (newSlug !== slug) {
				slug = newSlug;
				handleSlugChange(newSlug);
			}
		});
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>NOLA Devs</title>
	<meta name="description" content="" />
</svelte:head>

<div class="group">
	<div class="section">
		<div class="groupCard">
			{#key group}
				<GroupCard groupData="{group}" />
			{/key}
		</div>
		<div class="carousel">
			<Carousel />
		</div>
	</div>

	<div class="event-list">
		{#key events}
			{#if events}
				{#each events as event}
					<EventCard {event} />
				{/each}
			{/if}
		{/key}
	</div>
</div>

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
