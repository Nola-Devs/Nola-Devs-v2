<script lang="ts">
	import {
		Drawer,
		CloseButton,
		NavBrand,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		DarkMode
	} from 'flowbite-svelte';

	import { sineIn } from 'svelte/easing';

	import { groupIconsMap } from './icon/icons';
	import Icon from './icon/index.svelte';
	export let hidden: boolean = true;
	export let data: { groups: { name: string; slug: string }[] };

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	const getGroupPath = (slug: string) => `/group/${slug}`;
</script>

<Drawer
	transitionType="fly"
	{transitionParams}
	bind:hidden
	id="sidebar2"
	bgColor="{'bg-[#24072F]'}"
	bgOpacity="{'bg-opacity-70'}"
	divClass="bg-white dark:bg-primary-dark z-50 p-4 overflow-y-auto"
>
	<div class="flex items-center">
		<NavBrand
			href="/"
			class="inline-flex items-center  font-cute text-5xl leading-10 text-gray-900 dark:text-violet-100"
		>
			N0LA<span class="text-[#6628CC]">{'[DEVS]'}</span>
		</NavBrand>
		<CloseButton on:click="{() => (hidden = true)}" class="mb-4 dark:text-white" />
	</div>
	<Sidebar>
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded ">
			<h2 class="font-semibold leading-7 text-lg text-violet-500 mb-4">Community Groups</h2>
			<SidebarGroup>
				{#each data.groups as { name, slug }}
					<SidebarItem
						href="{getGroupPath(slug)}"
						label="{name}"
						class="group dark:hover:text-white hover:text-white hover:bg-purple-700 font-medium dark:hover:bg-purple-700"
					>
						<svelte:fragment slot="icon">
							{#if groupIconsMap[slug]}
								<Icon
									name="{groupIconsMap[slug]}"
									className="h-6 w-6 text-gray-500 dark:text-violet-300 group-hover:text-white"
								/>
							{/if}
						</svelte:fragment>
					</SidebarItem>
				{/each}
			</SidebarGroup>
		</SidebarWrapper>

		<h2 class="font-semibold leading-7 text-lg text-violet-500 my-4">Organization Info</h2>
		<SidebarGroup class="flex items-center space-y-0 gap-3">
			<SidebarItem
				href="/about"
				label="About"
				class="font-base px-2 py-1 hover:bg-transparent dark:hover:bg-transparent leading-[24px] text-gray-400 hover:text-gray-600 dark:text-violet-100 dark:hover:text-violet-300"
				spanClass=""
			></SidebarItem>
			<SidebarItem
				href="/contact"
				label="Contact"
				class="font-base px-2 py-1 hover:bg-transparent dark:hover:bg-transparent leading-[24px] text-gray-400 hover:text-gray-600 dark:text-violet-100 dark:hover:text-violet-300"
				spanClass=""
			></SidebarItem>
			<DarkMode btnClass="ml-5">
				<Icon name="moonIcon" slot="darkIcon" size="{24}" />
				<Icon name="sunIcon" slot="lightIcon" size="{24}" />
			</DarkMode>
		</SidebarGroup>
	</Sidebar>
</Drawer>
