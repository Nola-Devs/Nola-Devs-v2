<script lang="ts">
	import type { PageData } from './$types';
	import Carousel from '../../components/carousel.svelte';
	import { EventCard, GroupCard } from '$components'
  import { page } from "$app/stores";

  $: slug = $page.params.group.split('=')[1]

	// TODO: USE slug to grab data(group and events) using fetch

	
	export let data: PageData;
	$: group = data.group;
	$: events = data.events;
</script>

<svelte:head>
	<title>NOLA Devs</title>
	<meta name="description" content="" />
</svelte:head>
<div class="group">
	<div class="section">
		<div class="groupCard">
			<GroupCard groupData="{group}" />
		</div>
		<div class="carousel">
			<Carousel />
		</div>
	</div>
	<p>{slug}</p>

	{#if events !== undefined}
		<div class="event-list">
			{#key events}
				{#each events.events as e}
					<EventCard event="{e}" />
				{/each}
			{/key}
		</div>
	{/if}
</div>

<style>
	.event-list {
		scroll-behavior: smooth;
		overflow-y: auto;
		border-radius: 10px;
		clip-path: fill-box;
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 3px;
		scroll-snap-type: y mandatory;
	}

	.groupCard,
	.carousel {
		scroll-snap-align: start;
		height: 100%;
	}

	.section {
		overflow: auto;
		scroll-snap-type: y mandatory;
		display: grid;
		clip-path: fill-box;
		border-radius: 10px;
		grid-template-rows: [first] 100% [line2] auto;
	}

	.group {
		height: 100vh;
		padding: 5px;
		display: grid;
		grid-template-rows: [first] 40% [line2] auto;
		gap: 3px;
	}
</style>
