<script lang="ts">
	import '/src/app.css';

	import Nav from '$lib/components/nav.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import CustomAlert, { AlertType } from '$lib/components/alert.svelte';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' })

	// TODO: Add to cookies for alert if dismissed or done to not show again
</script>

<div class="flex h-screen 3xl:mx-auto 3xl:max-w-screen-2xl">
	<Sidebar {data} />
	<main class="flex flex-1 w-full px-4 sm:px-8 3xl:px-0 md:overflow-hidden">
		<div class="max-w-[85rem] mx-auto 3xl:px-10 flex flex-col gap-6 flex-1">
			<Nav {data} />
			<!-- <CustomAlert
				type="{AlertType.Update}"
				message="We've updated our site, let us know how we're doing by filling a short survey"
				link="/survey"
				linkText="here"
			/> -->
			<slot />
		</div>
	</main>
</div>
