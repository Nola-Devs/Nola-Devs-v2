<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="p-6 max-w-4xl mx-auto flex flex-col gap-4">
	<header>
		<h1 class="text-2xl font-bold">Organizer</h1>
		<p class="text-sm text-gray-600 dark:text-gray-300">
			{data.scopeKind === 'all' ? 'All upcoming events' : 'Events for your groups'}
		</p>
	</header>

	{#if data.events.length === 0}
		<Card>
			<div class="p-4 text-sm text-gray-600 dark:text-gray-300">
				No upcoming events available to manage.
			</div>
		</Card>
	{:else}
		<div class="flex flex-col gap-3">
			{#each data.events as event}
				<Card>
					<div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
						<div>
							<h2 class="font-semibold">{event.meetupName}</h2>
							<p class="text-sm text-gray-600 dark:text-gray-300">
								{event.groupName} · {new Date(event.start).toLocaleString()}
							</p>
						</div>
						<Button href="/admin/organizer/event/{event.eventSlug}/pizza">Pizza</Button>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
