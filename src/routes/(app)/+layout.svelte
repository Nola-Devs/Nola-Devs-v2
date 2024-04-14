<script lang="ts">
	import '/src/app.css';

	import Nav from '$lib/components/nav.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import CustomAlert, { AlertType } from '$lib/components/alert.svelte';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	// TODO: Add to cookies for alert if dismissed or done to not show again
</script>

<div class="flex h-screen w-screen 3xl:mx-auto 3xl:max-w-screen-2xl overfloww-hidden">
	<Sidebar {data} />
	<main class="grid grid-rows-[200px_500px-auto] w-full p-4 sm:px-8 3xl:px-0 overfloww-hidden">
		<!-- <div class="max-w-[85rem] mx-auto 3xl:px-10 flex flex-col gap-6 flex-1 "> -->
		<Nav {data} />
		<CustomAlert
			type="{AlertType.Update}"
			message="We've updated our site, let us know how we're doing by filling a short survey"
			link="/survey"
			linkText="here"
		/>
		<div class="h-full">
			<slot />
		</div>
	</main>
</div>
