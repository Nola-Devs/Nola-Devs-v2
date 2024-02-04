<script lang="ts">
	import GroupCard from '$lib/components/group-card.svelte';
	import Carousel from '$lib/components/carousel.svelte';
	import EventList from '$lib/components/event-list.svelte';

	import type { Event, User } from '$types';
	import type { PageData } from './$types';

	import { P, Heading, Img } from 'flowbite-svelte';

	export let data: PageData;
	$: group = data.group;

	let events: Event[];
	$: events = data.events;

	let organizers: User[];
	$: organizers = data.organizers;
</script>

<svelte:head>
	<title>NOLA Devs</title>
	<meta name="description" content="{group.group}" />
</svelte:head>

<Carousel />
<GroupCard {group} />

<Heading tag="h4">Organgized By:</Heading>
{#each organizers as organizer}
	{#if organizers.pfp}
		<Img src="{organizer.pfp}" />
	{:else}
		<Img
			imgClass="w-32 rounded"
			src="https://3etagenleben.de/wp-content/uploads/2019/03/blank-profile-picture-973460-e1554219898755.png"
		/>
	{/if}
	<P>
		{organizer.name}
	</P>
{/each}

<EventList {events} />
