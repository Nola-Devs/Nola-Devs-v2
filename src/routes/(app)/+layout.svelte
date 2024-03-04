<script lang="ts">
	import { dev } from '$app/environment';
	import '/src/app.css';

	// import { inject } from '@vercel/analytics';
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/navbar.svelte';

	export let data: LayoutData;
	const groups = data.groups;
	// inject({ mode: dev ? 'development' : 'production' });
	//class="h-screen w-screen grid grid-cols-[200px_auto] max-sm:grid-cols-[unset] max-sm:grid-row-[100px_auto]"
</script>

<div>
	<NavBar {groups} />
	<div class="mt-8">
		<slot />
	</div>
</div>
