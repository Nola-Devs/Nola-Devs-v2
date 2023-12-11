<script lang="ts">
	//import type { PageData } from './$types';
	import Carousel from '../../../components/carousel.svelte';
	import { EventCard, GroupCard } from '$components';

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
			{#key group}
				{#if group}
					<GroupCard groupData="{group}" />
				{/if}
			{/key}
		</div>
		<div class="carousel">
			<Carousel />
		</div>
	</div>

	<div class="section">
		{#key group.events}
			{#if group.events}
				{#each group.events as event}
					<EventCard {event} />
				{/each}
			{/if}
		{/key}
	</div>
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
		margin: auto 3px;
		border-radius: 5px;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		clip-path: fill-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 5px;
	}

	.group {
		margin: 5px;
		border-radius: 10px;
		overflow: auto;
		scroll-snap-type: y mandatory;
		display: grid;
		clip-path: fill-box;
		grid-template-rows: [details] 100% [carousel] 100%;
	}
	.groupinfo {
		height: 100vh;
		display: grid;
		grid-template-rows: [info] 40% [events] auto;
	}
</style>
