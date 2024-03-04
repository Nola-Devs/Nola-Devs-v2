<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		DarkMode,
		MegaMenu
	} from 'flowbite-svelte';
	import LogoWide from '$lib/assets/icons/Logo-wide.svelte';
	export let groups: string[];
	let groupItems: { name: string; href: string }[] = groups.map((e: string) => {
		return { name: e, href: '/group/' + e.replace(/ /g, '-') };
	});
</script>

<Navbar fluid class="fixed top-0 bg-primary-100 dark:bg-primary-900" let:hidden let:toggle>
	<NavBrand href="/">
		<LogoWide styles="w-34 h-10 m-0 p-1" />
	</NavBrand>

	<div class="flex md:order-2">
		<DarkMode />
		<NavHamburger on:click="{toggle}" />
	</div>
	<NavUl {hidden} class="order-1 " ulClass="flex bg-primary-100 justify-around dark:bg-primary-900">
		<NavLi class="text-xs md:p-1" href="/" active="{true}">Home</NavLi>
		<NavLi class="text-xs md:p-1" href="/">About</NavLi>
		<NavLi class="text-xs md:p-1" href="/">Navbar</NavLi>
		<NavLi class="text-xs md:p-1">TechGroups</NavLi>
		<MegaMenu
			full
			items="{groupItems}"
			let:item
			class="'grid grid-flow-row w-full px-0 md:gap-x-3 auto-col-max auto-row-max bg-primary-100 dark:bg-primary-900"
		>
			<a
				href="{item.href}"
				class="hover:underline hover:text-primary-600 dark:hover:text-primary-500 text-xs"
			>
				{item.name}
			</a>
		</MegaMenu>
	</NavUl>
</Navbar>
