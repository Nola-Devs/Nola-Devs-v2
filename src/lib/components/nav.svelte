<script>
	import { Navbar, NavLi, NavUl, Input, DarkMode } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import Icon from './icon/index.svelte';
</script>

<Navbar class="flex justify-between items-center !bg-transparent !px-0">
	<div class="flex grow items-center">
		<div class="relative max-w-[364px] w-full">
			<div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
				<SearchOutline class="w-4 h-4 text-gray-500" />
			</div>
			<Input
				id="search-navbar"
				class="ps-10 bg-white border-gray-200 dark:bg-white/10 dark:border-white/10 placeholder:text-gray-500"
				placeholder="Search Nola Devs"
			/>
		</div>
	</div>
	<NavUl>
		<NavLi
			href="/about"
			class="font-base font-medium leading-[24px] text-gray-400 dark:text-violet-100">About</NavLi
		>
		<NavLi
			href="/contact"
			class="font-base font-medium leading-[24px] text-gray-400 dark:text-violet-100">Contact</NavLi
		>
		<NavLi>
			<DarkMode btnClass="inline-flex">
				<Icon name="moonIcon" slot="darkIcon" size="{24}" />
				<Icon name="sunIcon" slot="lightIcon" size="{24}" />
			</DarkMode>
		</NavLi>
	</NavUl>
</Navbar>
