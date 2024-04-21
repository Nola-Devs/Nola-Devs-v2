<script lang="ts">
	import { Img, P, A } from 'flowbite-svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import IconParse from '$lib/components/icon-parser.svelte';
	import type { User } from '$lib/types/user.d.ts';

	export let organizers: User[];
</script>

<aside class="w-full md:px-6">
	<h3
		class="text-xl font-semibold text-gray-800 dark:text-violet-100 leading-7 border-b border-violet-200 pb-4 mb-4"
	>
		Organizers
	</h3>
	{#each organizers as { name, pfp, email, links }}
		<div class="flex items-center gap-4">
			{#if !pfp}
				<img class="w-9 h-9 rounded" src="/images/organizers/default-pfp.webp" alt="Organizer 1" />
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
