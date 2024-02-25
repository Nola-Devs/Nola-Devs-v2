<script lang="ts">
	import HomePageHero from '$lib/components/homepage-hero.svelte';
	import type { Event } from '$types';
	import type { PageData } from './$types';
	import EventList from '$lib/components/event-list.svelte';

	export let data: PageData;
	let events: Event[] = data.events;
</script>

<div class="grid grid-rows-[1fr_1fr] items-center h-full">
	<HomePageHero />

	<EventList {events} />
</div>
