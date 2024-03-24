<script lang="ts">
	import Icon from '$lib/components/icon/index.svelte';
	import SortingBar from '../sorting-bar.svelte';

	import type { Event } from '$lib/types/event.d.ts';
	import EventGrouping from './event-grouping.svelte';
	export let events: Event[];
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
	<EventGrouping {events} />
</section>
