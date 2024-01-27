<script lang="ts">
	import { dev } from '$app/environment';
	import '/src/app.css';

	// import { inject } from '@vercel/analytics';

	import type { LayoutData } from './$types';
	import SideBar from '$lib/components/sidebar.svelte';
	import MobileMenu from '$lib/components/mobile.svelte';

	export let data: LayoutData;
	let y: number;
	$: isHidden = y > 800;

	// inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:window bind:innerWidth="{y}" />
<div
	id="main "
	class="min-h-dvh w-full flex flex-col md:flex-row gap-x-2 font-read overflow-y-hidden"
>
	<nav class=" h-24 w-full md:w-[200px] md:min-h-dvh relative overflow-hidden">
		<MobileMenu {data} />
		<SideBar {data} />
	</nav>

	<div class="w-full bg-gray-50 max-w-6xl mx-auto p-2 min-h-dvh">
		<slot />
	</div>
</div>

<style>
	:global(:root) {
		--shadow-move-up: 0 0 10px rgba(0, 0, 0, 0.568);
		--shadow-move-back: inset -5px -5px 10px rgba(0, 0, 0, 0.621), inset 5px 5px 10px white;
		--card-bg: #e9e9e9;
		--title: 'watchword', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--small-title: 'panton', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--read: 'kabrio', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--card-radius: 10px;
		--button-color: rgb(184, 184, 184);
	}
</style>
