<script lang="ts">
	import { dev } from '$app/environment';
	import '/src/app.css';

	// import { inject } from '@vercel/analytics';
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/navbar.svelte';

	export let data: LayoutData;
	const groups = data.groups;
	// inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="grid grid-cols-[14rem,_1fr] max-sm:grid-cols-[unset] max-sm:grid-rows-[1rem,_1fr]">
	<div class="z-2">
		<NavBar {groups} />
	</div>
	<div class="pt-10 p-3 h-screen max-sm:w-full">
		<slot />
	</div>
</div>
