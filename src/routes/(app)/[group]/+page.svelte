<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import GroupCard from '$lib/components/group-card.svelte';
	import Carousel from '$lib/components/carousel.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: group = data.group;
</script>

<svelte:head>
	<title>NOLA Devs</title>
	<meta name="description" content="" />
</svelte:head>

<div class="groupinfo">
	<div class="group">
		<div class="groupCard">
			{#if group}
				<GroupCard groupData="{group}" />
			{/if}
		</div>
		<div class="carousel">
			<Carousel />
		</div>
	</div>

	{#if group.events.length}
	
	<div class="section">
		{#each group.events as event}
		{#key event}
			<EventCard {event} />
			{/key}
			{/each}
		</div>
	{/if}
</div>

<style>
	.groupCard,
	.carousel {
		scroll-snap-align: start;
		height: 100%;
	}

	.section {
		height: 100%;
		width: 100%;
		gap: 3px;
		padding: 2.5px 5px 5px 5px;
		border-radius: 20px;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		clip-path: fill-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.group {
		padding: 5px 5px 2.5px 5px;
		border-radius: 20px;
		overflow: auto;
		scroll-snap-type: y mandatory;
		display: grid;
		clip-path: fill-box;
		grid-template-rows: [details] 100% [carousel] 100%;
	}
	.groupinfo {
		height: 100vh;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: [info] auto [events] 60%;
	}

	@media only screen and (max-width: 800px) {
		.groupinfo {
			display: flex;
			flex-direction: column;
			grid-template-columns: unset;
			height: 100%;
		}
		.group {
			display: flex;
			flex-direction: column;
			grid-template-rows: unset;
			overflow: visible;
		}
		.section {
			height: fit-content;
		}
	}
</style>
