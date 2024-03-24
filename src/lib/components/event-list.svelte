<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import SortingBar from './sorting-bar.svelte';

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

<section aria-labelledby="upcoming-events-heading" class="flex flex-col flex-1">
	<header class="flex flex-col gap-3 justify-center w-full mb-4">
		<h2
			class="text-2xl md:text-3xl font-semibold leading-[27px] text-[#24072F] dark:text-violet-100"
		>
			Whats going on in the city
		</h2>
		<div class="flex justify-between">
			<SortingBar />
			<button
				class="inline-flex gap-2.5 px-3 py-1 text-violet-500 border border-violet-500 rounded-lg hover:text-white hover:bg-violet-500 transition-colors text-sm font-medium items-center"
				on:click="{() => console.log('Add an Event')}"
			>
				Add an Event
				<Icon name="plusIcon" size="{20}" />
			</button>
		</div>
	</header>
	{#if Object.keys(groupedEvents).length > 0}
		<div class="md:flex-1 md:overflow-y-auto">
			{#each Object.keys(groupedEvents) as category}
				<div class="border-b border-violet-200 py-4">
					<h3 class="text-xl font-semibold text-gray-800 dark:text-violet-100 leading-7">
						{category}
					</h3>
				</div>
				<div class="flex flex-col gap-4 h-72">
					{#each groupedEvents[category] as event}
						<EventCard {event} />
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center font-medium text-gray-500 dark:text-violet-50">
			<p>No upcoming events at the moment. Check back soon!</p>
		</div>
	{/if}
</section>
