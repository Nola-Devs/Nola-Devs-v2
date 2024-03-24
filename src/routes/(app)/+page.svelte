<script lang="ts">
	import type { Event } from '$lib/types/Event';
	import type { PageData } from './$types';

	export let data: PageData;
	let events: Partial<Event[]> = data.events;

	import Banner from '$lib/components/banner.svelte';
	import EventList from '$lib/components/event-list.svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Banner
		title="Developers, Designers, Lend Me Your Ears"
		description="We’re a community of developers, entrepreneurs, students, and enthusiasts who are excited about the future of technology.  Join us to share projects, attend events, and learn something new!"
		linkText="Community Slack"
		linkHref="https://join.slack.com/t/nola/shared_invite/zt-256vzyuvo-1KC88G~MLCT8KCgw4QL7zg"
		linkIcon="slackIcon"
		bannerClass="bg-homeBanner text-white"
	/>
		<EventList {events} />
</div>
