<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import type { Event } from '$types';
	export let events: Event[];
</script>

<div class="flex gap-3">
	{#each events as event}
		<EventCard {event} />
	{/each}
</div>
