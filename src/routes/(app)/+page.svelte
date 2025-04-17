<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let events = data.events;

	import Banner from '$lib/components/banners/home-banner.svelte';
	import EventList from '$lib/components/event/event-list.svelte';

	// TODO: Setup Banner object with schema and pass into DB
</script>

<div class="flex flex-col gap-6 flex-1 h-screen max-sm:h-fit">
	<Banner
		title="Developers, Designers, Lend Me Your Ears"
		description="We’re a community of developers, entrepreneurs, students, and enthusiasts who are excited about the future of technology.  Join us to share projects, attend events, and learn something new!"
		linkText="Community Slack"
		linkHref="https://join.slack.com/t/nola/shared_invite/zt-33so6nl8m-qDq5rDFrMnw5eeXcERP7jA"
		linkIcon="slackIcon"
		bannerClass="bg-homeBanner text-white"
	/>
	<EventList {events} />
</div>
