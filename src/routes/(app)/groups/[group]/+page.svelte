<script lang="ts">
	import GroupCard from '$lib/components/group-card.svelte';
	import Carousel from '$lib/components/carousel.svelte';
	import EventList from '$lib/components/event-list.svelte';
	import OrganizerList from '$lib/components/organizer-list.svelte';

	import type { Event, User } from '$types';
	import type { PageData } from './$types';

	import { Heading } from 'flowbite-svelte';

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

<div class="p-3">
	<Carousel />

	<GroupCard {group} />

	<Heading tag="h4">Organized By:</Heading>

	<OrganizerList {organizers} />

	<EventList {events} />
</div>
