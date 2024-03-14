<script lang="ts">
	import '/src/app.css';

	import type { LayoutData } from './$types';
	import { NavBrand, AccordionItem, Accordion } from 'flowbite-svelte';
	export let data: LayoutData;
	const groups = data.groups;

	const getGroupPath = (groupName: string) => `/groups/${encodeURIComponent(groupName)}`;
</script>

<div class="flex min-h-screen">
	<aside class="bg-white dark:bg-primary-dark py-8 px-6 flex flex-col gap-12 w-full max-w-[272px]">
		<NavBrand href="/" class="inline-flex items-center justify-center font-cute text-5xl leading-10">
			<!-- <LogoWide styles="w-full h-12" /> --> 
			N0LA<span class="text-[#6628CC]">{"[DEVS]"}</span>
		</NavBrand>

		<div class="w-full">
			<Accordion>
				<!-- Events Accordion Item -->
				<AccordionItem
					borderOpenClass="!border-none"
					class="py-1.5 px-2 border-none !rounded-md text-gray-900"
					classActive="bg-primary-light !text-violet-500 text-base font-medium leading-[24px]"
				>
					<span slot="header">Events</span>
					<p>Events here...</p>
				</AccordionItem>
				<!-- Tech Groups Accordion Item -->
				<AccordionItem
					open
					borderOpenClass="!border-none py-1.5 px-0"
					class="py-1.5 px-2 border-none !rounded-md text-gray-900"
					classActive="bg-primary-light !text-violet-500 text-base font-medium leading-[24px]"
				>
					<span slot="header">Tech Groups</span>
					<ul class="list-none p-0 space-y-1.5">
						{#each groups as group}
							<li>
								<a
									href="{getGroupPath(group)}"
									class="block py-2 px-4 text-base font-medium leading-[24px] text-gray-900 transition-colors"
								>
									{group}
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
