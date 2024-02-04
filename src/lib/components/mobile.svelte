<script lang="ts">
	import { Dropdown, DropdownItem, Button, DarkMode, Card } from 'flowbite-svelte';
	import { BarsSolid } from 'flowbite-svelte-icons';
	import LogoWide from '$lib/assets/icons/Logo-wide.svelte';

	export let groups: string[];
	let isClosed: boolean;
	const toggleDraw = () => (isClosed = !isClosed);
</script>

<Card class="fixed flex flex-row px-3 py-1 top-1 right-1 z-10 mr-3 sm:hidden">
	<DarkMode />
	<Button><BarsSolid class="duration-300 {isClosed ? 'rotate-90' : ''}" /></Button>
	<Dropdown class="w-56 p-3" bind:open="{isClosed}">
		{#each groups as group}
			<DropdownItem defaultClass="" on:click="{toggleDraw}" href="/group/{group.replace(/ /g, '-')}"
				>{group}</DropdownItem
			>
		{/each}
	</Dropdown>
</Card>
