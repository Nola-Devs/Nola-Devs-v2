<script lang="ts">
	import EventCard from './event-card.svelte';
	import type { Event } from '$lib/types/event.d.ts';

	export let events: Event[];

	interface GroupedEvents {
		[category: string]: Event[];
	}

	function categorizeEvent(eventDate: Date): string {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (eventDate >= today && eventDate < tomorrow) {
			return 'Today';
		} else if (
			eventDate >= tomorrow &&
			eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
		) {
			return 'Tomorrow';
		} else {
			return 'Upcoming';
		}
	}

	const categorizedEvents = events
		.map((event) => ({
			...event,
			category: categorizeEvent(new Date(event.start))
		}))
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

	const groupedEvents: GroupedEvents = categorizedEvents.reduce((acc: GroupedEvents, event) => {
		const category = event.category;
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(event);
		return acc;
	}, {});
</script>

<div class="md:flex-1 md:overflow-y-auto">
	{#if Object.keys(groupedEvents).length > 0}
		{#each Object.keys(groupedEvents) as category}
			<h3
				class="text-xl font-semibold text-gray-800 dark:text-violet-100 leading-7 border-b border-violet-200 py-4 mb-4"
			>
				{category}
			</h3>
			<div class="flex flex-col gap-4 h-72">
				{#each groupedEvents[category] as event}
					<EventCard {event} />
				{/each}
			</div>
		{/each}
	{:else}
		<div class="text-center font-medium text-gray-500 dark:text-violet-50">
			<p>No upcoming events at the moment. Check back soon!</p>
		</div>
	{/if}
</div>
