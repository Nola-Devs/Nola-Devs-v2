<script>
	import { Navbar, NavLi, NavUl, Input, DarkMode } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
</script>

<Navbar class="flex justify-between items-center !bg-transparent !px-0">
	<div class="flex grow items-center">
        <div class="relative max-w-[364px] w-full">
            <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
                <SearchOutline class="w-4 h-4" />
			</div>
			<Input id="search-navbar" class="ps-10" placeholder="Search Nola Devs" />
		</div>
	</div>
	<NavUl>
        <NavLi href="/about">About</NavLi>
		<NavLi href="/contact">Contact</NavLi>
		<NavLi><DarkMode btnClass="inline-flex"/></NavLi>
	</NavUl>
</Navbar>
