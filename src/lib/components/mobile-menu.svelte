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
	export let data: { groups: { name: string; slug: string; icon: string }[] };

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	const closeSidebar = () => (hidden = true);
	const getGroupPath = (slug: string) => `/group/${slug}`;
</script>

<Drawer
	transitionType="fly"
	{transitionParams}
	open="{!hidden}"
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
			<button on:click="{closeSidebar}">
				N0LA<span class="text-[#6628CC]">{'[DEVS]'}</span>
			</button>
		</NavBrand>
	</div>
		<div class="hover:bg-purple-700 rounded-lg group transition-colors">
		<a
			data-sveltekit-reload
			href="/letmein"
			class="inline-flex items-center justify-start py-2 px-4 text-base leading-[24px] group-hover:text-white text-gray-900 dark:text-white w-full h-full font-semibold"
			aria-label="Let Me In!"
		>
			<span class="text-base font-medium leading-[24px]">Let Me In!</span>
		</a>
	</div>

	<div class="w-full space-y-4">
		<h2 class="font-semibold leading-7 text-lg text-violet-500">Community Groups</h2>
		<ul class="list-none p-0 space-y-1.5">
			{#each data.groups as { name, slug, icon }}
				<li class="hover:bg-purple-700 rounded-lg group transition-colors">
					<a
						data-sveltekit-reload
						href="/group/{slug}"
						class="inline-flex items-center justify-start gap-3 py-2 px-4 text-base font-medium leading-[24px] group-hover:text-white text-gray-900 dark:text-white w-full h-full"
						aria-label="{`Group ${name}`}"
					>
						<span class="text-base font-medium leading-[24px]">{icon} {name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<h2 class="font-semibold leading-7 text-lg text-violet-500 my-4">Organization Info</h2>
	<SidebarGroup class="flex items-center space-y-0 gap-3">
		<SidebarItem
			href="/about"
			label="About"
			class="font-base px-2 py-1 hover:bg-transparent dark:hover:bg-transparent leading-[24px] text-gray-400 hover:text-gray-600 dark:text-violet-100 dark:hover:text-violet-300"
			spanClass=""
			onclick="{closeSidebar}"
		></SidebarItem>
		<SidebarItem
			href="/contact"
			label="Contact"
			class="font-base px-2 py-1 hover:bg-transparent dark:hover:bg-transparent leading-[24px] text-gray-400 hover:text-gray-600 dark:text-violet-100 dark:hover:text-violet-300"
			spanClass=""
			onclick="{closeSidebar}"
		></SidebarItem>
		<DarkMode btnClass="ml-5">
			<Icon name="moonIcon" slot="darkIcon" size="{24}" />
			<Icon name="sunIcon" slot="lightIcon" size="{24}" />
		</DarkMode>
	</SidebarGroup>
</Drawer>
