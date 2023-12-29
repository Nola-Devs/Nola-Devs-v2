<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	export let eventsArray: Event[];
	$: eventsArray;
</script>

<!-- {#if eventsArray.length}
{#each eventsArray as event}
 <EventCard {event}/>
{/each}
{/if} -->
