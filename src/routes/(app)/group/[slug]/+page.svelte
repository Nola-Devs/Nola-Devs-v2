<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let { group, events } = data;
	$: group = data.group;
	$: events = data.events;

	import GroupBanner from '$lib/components/banners/group-banner.svelte';
	import EventGrouping from '$lib/components/event/event-grouping.svelte';
	import Icon from '$lib/components/icon/index.svelte';
</script>

<div class="flex flex-col flex-1">
	<GroupBanner
		title="{group?.group || 'Group Name'}"
		description="Every Second Tuesday  • 5:30 P.M. - 7:00 P.M."
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
			<aside class="w-full md:px-6">
				<h3
					class="text-xl font-semibold text-gray-800 dark:text-violet-100 leading-7 border-b border-violet-200 pb-4 mb-4"
				>
					Organizers
				</h3>
				<div class="flex items-center gap-4">
					<img
						class="w-9 h-9 rounded"
						src="/images/organizers/default-pfp.webp"
						alt="Organizer 1"
					/>
					<div class="flex flex-col gap-1">
						<p class="text-base text-gray-800 dark:text-violet-200">John Doe</p>
						<div class="flex gap-3 px-2 items-center text-gray-400">
							<Icon name="linkedInIcon" size="{18}" viewBox="0 0 18 18" />
							<Icon name="githubIcon" size="{18}" viewBox="0 0 18 18" />
							<Icon name="mailIcon" size="{18}" viewBox="0 0 23 16" />
						</div>
					</div>
				</div>
			</aside>
		</article>

		<EventGrouping {events} />
	</section>
</div>
