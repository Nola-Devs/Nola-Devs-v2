<script lang="ts">
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte';
	import { ChevronDownSolid } from 'flowbite-svelte-icons';

	let sortBy = 'time'; // Default sort option
	const options = {
		time: 'Sort by Time',
		group: 'Sort by Group',
		interest: 'Sort by Interest'
	};
</script>

<div class="hidden sm:flex gap-2 items-center">
	{#each Object.entries(options) as [value, label]}
		<div class="relative">
			<Button
				class="inline-flex items-center bg-transparent dark:bg-transparent dark:text-violet-300 dark:hover:bg-transparent text-gray-900 py-2 px-3 hover:bg-transparent focus:ring-0"
			>
				{label}
				<ChevronDownSolid class="ml-2 w-2 h-2" />
			</Button>
			<Dropdown class="w-48">
				<DropdownItem>
					<Radio name="sort" bind:group="{sortBy}" {value}>{label}</Radio>
				</DropdownItem>
			</Dropdown>
		</div>
	{/each}
</div>

<div class="sm:hidden">
	<div class="relative">
		<Button
			class="inline-flex items-center bg-transparent dark:bg-transparent dark:text-violet-300 dark:hover:bg-transparent text-gray-900 py-2 px-3 hover:bg-transparent focus:ring-0"
		>
			Sort By
			<ChevronDownSolid class="ml-2 w-2 h-2" />
		</Button>
		<Dropdown class="w-48">
			{#each Object.entries(options) as [value, label]}
				<DropdownItem>
					<Radio name="sort" bind:group="{sortBy}" {value}>{label}</Radio>
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
</div>
