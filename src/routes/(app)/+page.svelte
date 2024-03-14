<script lang="ts">
	import type { Event } from '$types';
	import type { PageData } from './$types';

	export let data: PageData;
	let events: Event[] = data.events;

	import CustomAlert, { AlertType } from '$lib/components/alert.svelte';
	import Nav from '$lib/components/nav.svelte';
	import Slider from '$lib/components/slider.svelte';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import EventList from '$lib/components/event-list.svelte';
</script>

<div class="w-full flex flex-col gap-6 h-full">
	<!-- Alert -->
	<CustomAlert
		type="{AlertType.Update}"
		message="We've updated our site, let us know how we're doing by filling a short survey"
		link="/survey"
		linkText="here"
	/>
	<!-- Nav -->
	<Nav />
	<!-- BreadCrumb -->
	<Breadcrumb />
	<!-- Banner Slider -->
	<Slider />
	<!-- Upcomming events -->
	<EventList {events} />
</div>
