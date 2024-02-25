<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import MobileMenu from '$lib/components/mobile.svelte';
	import LogoWide from '$lib/assets/icons/Logo-wide.svelte';
	export let groups: string[];
	let y: number;
</script>

<svelte:window bind:innerWidth="{y}" />
<!--
	TODO: Implement a seach Feature
	<div>
		<Input class="w-full" placeholder="Search Nola Devs">
			<SearchOutline slot="left" class="w-4 h-4" />
		</Input>
	</div>
	-->
<a href="/" class="fixed top-1 left-1 mt-3 z-10 bg-white rounded-xl dark:bg-slate-800">
	<LogoWide styles="w-34 h-12 m-0 p-1" />
</a>
{#if y > 640}
	<Sidebar {groups} />
{:else}
	<MobileMenu {groups} />
{/if}
