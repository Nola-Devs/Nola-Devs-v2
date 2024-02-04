<script lang="ts">
	import HomePageHero from '$lib/components/homepage-hero.svelte';
	import type { Event } from '$types';
	import type { PageData } from './$types';
	import EventList from '$lib/components/event-list.svelte';

	export let data: PageData;
	let events: Event[] = data.events;
</script>

<div class="grid grid-rows-[1fr,_auto] h-full gap-3">
	<div>
		<HomePageHero />
	</div>

	<div>
		<EventList {events} />
	</div>
</div>
