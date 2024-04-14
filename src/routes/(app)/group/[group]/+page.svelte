<script lang="ts">
	import type { Event } from '$lib/types/event';
	import type { PageData } from './$types';
	import IconParse from '$lib/components/icon-parser.svelte';
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
			{#if users.length}
				<aside class="w-full md:px-6">
					<h3
						class="text-xl font-semibold text-gray-800 dark:text-violet-100 leading-7 border-b border-violet-200 pb-4 mb-4"
					>
						Organizers
					</h3>
					{#each users as { name, pfp, email, links }}
						<div class="flex items-center gap-4">
							{#if !pfp}
								<img
									class="w-9 h-9 rounded"
									src="/images/organizers/default-pfp.webp"
									alt="Organizer 1"
								/>
							{:else}
								<img class="w-9 h-9 rounded" src="{pfp}" alt="Organizer 1" />
							{/if}
							<div class="flex flex-col gap-1">
								<p class="text-base text-gray-800 dark:text-violet-200">{name}</p>
								<div class="flex gap-3 px-2 items-center dark:text-white">
									<a href="mailto:{email}">
										<Icon name="mailIcon" size="{18}" viewBox="0 0 23 16" />
									</a>
									{#each Object.keys(links) as link}
										<a href="{links.link}" target="_blank">
											<IconParse icon="{link}" />
										</a>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</aside>
			{/if}
		</article>
		<!-- TODO: Fix the handling of events -->
		<EventGrouping {events} />
	</section>
</div>
