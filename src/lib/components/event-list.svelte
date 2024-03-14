<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import type { Event } from '$types';
	export let events: Event[];
	import Icon from '$lib/components/icon/index.svelte';
</script>

<section aria-labelledby="upcoming-events-heading">
	<header class="flex justify-between items-center w-full mb-4">
		<h2 class="text-lg font-semibold leading-[27px] text-[#4F4F4F] dark:text-violet-100">
			Upcoming Events
		</h2>
		<a
			href="/events"
			class="text-violet-500 dark:text-violet-300 font-medium text-base leading-4 hover:scale-105 transition-transform"
		>
			<span>See all Events</span>
			<Icon
				name="rightArrowIcon"
				size="{20}"
				viewBox="0 0 20 20"
				className="inline-flex"
				ariaHidden
			/>
		</a>
	</header>
	{#if events.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each events as event}
				<EventCard {event} />
			{/each}
		</div>
	{:else}
		<div class="text-center font-medium text-gray-500 dark:text-violet-50">
			<p>No upcoming events at the moment. Check back soon!</p>
		</div>
	{/if}
</section>
