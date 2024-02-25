<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import type { Event } from '$types';
	export let events: Event[];
</script>

<div class="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-full gap-2 p-3">
	{#each events as event}
		<EventCard {event} />
	{/each}
</div>
