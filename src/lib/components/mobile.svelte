<script lang="ts">
	import { Dropdown, DropdownItem, Button, DarkMode } from 'flowbite-svelte';
	import { ChevronRightSolid } from 'flowbite-svelte-icons';
	import { BarsSolid } from 'flowbite-svelte-icons';

	export let groups: string[];
	let isClosed: boolean;
	const toggleDraw = () => (isClosed = !isClosed);
</script>

<div class="fixed right-1 top-1 gap-3 p-2 z-10 rounded-xl bg-white dark:bg-gray-800">
	<Button>
		<BarsSolid class="duration-300 {isClosed ? 'rotate-90' : ''}" />
	</Button>
	<Dropdown placement="right-start" bind:open="{isClosed}">
		<DropdownItem class="flex items-center justify-between">
			Groups<ChevronRightSolid class="w-3 h-3 ms-2 text-primary-700 dark:text-white" />
		</DropdownItem>
		<Dropdown placement="right-start" class="w-80 z-40">
			{#each groups as group}
				<DropdownItem
					activeClass="w-80 z-40"
					on:click="{toggleDraw}"
					href="/group/{group.replace(/ /g, '-')}"
				>
					{group}
				</DropdownItem>
			{/each}
		</Dropdown>

		<DropdownItem class="flex items-center justify-between">
			Meet The<ChevronRightSolid class="w-3 h-3 ms-2 text-primary-700 dark:text-white" />
		</DropdownItem>
		<Dropdown placement="right-start" class="w-40 z-20">
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">Organizers</DropdownItem>
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">Dev Team</DropdownItem>
		</Dropdown>
		<DropdownItem class="flex items-center justify-between">
			Other Links<ChevronRightSolid class="w-3 h-3 ms-2 text-primary-700 dark:text-white" />
		</DropdownItem>
		<Dropdown placement="right-start" class="w-40 z-20">
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">
				Mission Statement
			</DropdownItem>
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">Sponsors</DropdownItem>
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">Contact</DropdownItem>
			<DropdownItem activeClass="w-40" on:click="{toggleDraw}" href="/">
				Submit an Event
			</DropdownItem>
		</Dropdown>
	</Dropdown>
	<DarkMode />
</div>
