<script lang="ts">
	import type { Event } from '$lib/types/event';
	import type { PageData } from './$types';
	import IconParse from '$lib/components/icon-parser.svelte';
	import OrganizerList from '$lib/components/organizer-list.svelte';
	export let data: PageData;
	let { group, events } = data;
	$: group = data.group;
	$: events = data.events;
	$: users = data.users;

	import GroupBanner from '$lib/components/banners/group-banner.svelte';
	import EventGrouping from '$lib/components/event/event-grouping.svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import { A } from 'flowbite-svelte';
</script>

<div class="flex flex-col flex-1">
	<GroupBanner
		title="{group?.group || 'Group Name'}"
		description=""
		linkText="Website"
		linkHref="{group?.links.website || '#'}"
		linkIcon="linkIcon"
		bannerClass="bg-defaultBanner text-white"
	/>

	<section class="py-6 md:p-6 flex flex-col gap-8">
		<article class="flex flex-col md:flex-row gap-12 w-full">
			<section class="max-w-4xl min-h-36 text-[#24072F] dark:text-violet-100 space-y-3">
				<h3 class="font-semibold text-lg border-b border-violet-200 pb-4">About</h3>
				<p class="text-base leading-6 dark:text-violet-200">
					{group?.about}
				</p>
			</section>
			<OrganizerList organizers="{users}" />
		</article>
		<!-- TODO: Fix the handling of events -->
		<EventGrouping {events} />
	</section>
</div>
