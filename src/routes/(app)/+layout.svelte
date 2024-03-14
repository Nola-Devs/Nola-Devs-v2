<script lang="ts">
	import '/src/app.css';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	import { NavBrand, AccordionItem, Accordion } from 'flowbite-svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import { groupIconsMap } from '$lib/components/icon/icons';

	const groups = data.groups.map((groupName) => ({
		name: groupName,
		iconName: groupIconsMap[groupName] || null
	}));

	const getGroupPath = (groupName: string) => `/groups/${encodeURIComponent(groupName.replace(/ /g, '-'))}`;
</script>

<div class="flex min-h-screen">
	<aside class="bg-white dark:bg-primary-dark py-8 px-6 flex flex-col gap-12 w-full max-w-[272px] border-r border-[#EEE] dark:border-[#111827]">
		<NavBrand
			href="/"
			class="inline-flex items-center justify-center font-cute text-5xl leading-10 text-gray-900 dark:text-violet-100"
		>
			<!-- <LogoWide styles="w-full h-12" /> -->
			N0LA<span class="text-[#6628CC]">{'[DEVS]'}</span>
		</NavBrand>

		<div class="w-full">
			<Accordion>
				<!-- Events Accordion Item -->
				<AccordionItem
					borderOpenClass="!border-none"
					class="py-1.5 px-2 border-none !rounded-md text-gray-900 dark:text-violet-100 hover:bg-violet-100 dark:hover:bg-violet-300/20"
					classActive="bg-primary-light dark:bg-violet-500/20 !text-violet-500 text-base font-medium leading-[24px]"
				>
					<span slot="header">Events</span>
					<p>Events here...</p>
				</AccordionItem>
				<!-- Tech Groups Accordion Item -->
				<AccordionItem
					open
					borderOpenClass="!border-none py-1.5 px-0"
					class="py-1.5 px-2 border-none !rounded-md text-gray-900 dark:text-violet-100 hover:bg-violet-100 dark:hover:bg-violet-300/20"
					classActive="bg-primary-light dark:bg-violet-500/20 !text-violet-500 text-base font-medium leading-[24px]"
				>
					<span slot="header">Tech Groups</span>
					<ul class="list-none p-0 space-y-1.5">
						{#each groups as group}
							<li class="hover:bg-purple-700 rounded-lg group transition-colors">
								<a
									href="{getGroupPath(group.name)}"
									class="inline-flex items-center justify-start gap-3 py-2 px-4 text-base font-medium leading-[24px] group-hover:text-white text-gray-900 dark:text-white"
								>
									{#if group.iconName}
										<Icon
											name="{group.iconName}"
											size="{24}"
											className="text-gray-500 dark:text-violet-300 group-hover:text-white"
										/>
									{/if}
									<span class="text-base font-medium leading-[24px]">{group.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</AccordionItem>
			</Accordion>
		</div>
	</aside>
	<main class="px-[72px] py-8 w-full">
		<slot />
	</main>
</div>
