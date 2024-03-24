<script lang="ts">
	import { Navbar, NavLi, NavBrand, NavHamburger, NavUl, DarkMode } from 'flowbite-svelte';
	import Icon from './icon/index.svelte';
	import Breadcrumb from './breadcrumb.svelte';
	import MobileMenu from './mobile-menu.svelte';
	let isMobileMenuOpen = true;
	export let data: { groups: { name: string; slug: string }[] };
</script>

<Navbar fluid class="flex justify-between items-center !bg-transparent !px-0 !pt-8">
	<Breadcrumb />
	<NavBrand
		href="/"
		class="inline-flex lg:hidden items-center  font-cute text-5xl leading-10 text-gray-900 dark:text-violet-100"
	>
		N0LA<span class="text-[#6628CC]">{'[DEVS]'}</span>
	</NavBrand>
	<NavHamburger
		onClick="{() => (isMobileMenuOpen = !isMobileMenuOpen)}"
		class="md:block lg:hidden"
	/>
	<NavUl ulClass="p-0 flex gap-6 items-center font-medium" divClass="hidden md:hidden lg:block">
		<NavLi
			href="/about"
			class="font-base leading-[24px] text-gray-400 md:hover:text-gray-600 dark:text-violet-100 md:dark:hover:text-violet-300"
			>About</NavLi
		>
		<NavLi
			href="/contact"
			class="font-base leading-[24px] text-gray-400 md:hover:text-gray-600 dark:text-violet-100 md:dark:hover:text-violet-300"
			>Contact</NavLi
		>
		<div class="h-6 bg-gray-400 w-px dark:bg-violet-100"></div>

		<DarkMode btnClass="">
			<Icon name="moonIcon" slot="darkIcon" size="{24}" />
			<Icon name="sunIcon" slot="lightIcon" size="{24}" />
		</DarkMode>
	</NavUl>
</Navbar>

<MobileMenu {data} bind:hidden="{isMobileMenuOpen}" />
