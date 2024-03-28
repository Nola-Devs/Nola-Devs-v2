<script lang="ts">
	import SortingBar from '$lib/components/sorting-bar.svelte';
	import EventSubmission from '$lib/components/event-submission.svelte';

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
			<EventSubmission />
		</div>
	</header>
	<EventGrouping {events} />
</section>
