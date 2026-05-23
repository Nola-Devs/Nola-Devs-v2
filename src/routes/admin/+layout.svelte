<script lang="ts">
	import '/src/app.css';
	import { DarkMode } from 'flowbite-svelte';
	import LOGO from '$lib/assets/icons/Logo-wide.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: user = data.user;
	$: canOrganize = user?.role === 'orgAdmin' || user?.role === 'super';
</script>

<div class="flex justify-between items-center">
	<div class="h-8 w-36 m-4">
		<a href="/">
			<LOGO />
		</a>
	</div>
	<nav class="flex items-center gap-4 m-3">
		{#if canOrganize}
			<a
				href="/admin/organizer"
				class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-violet-100 dark:hover:text-violet-300"
			>
				Organizer
			</a>
		{/if}
		{#if user}
			<form method="post" action="/logout" class="m-0">
				<button
					type="submit"
					class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-violet-100 dark:hover:text-violet-300 bg-transparent border-0 cursor-pointer p-0"
				>
					Sign out
				</button>
			</form>
		{/if}
		<DarkMode />
	</nav>
</div>
<div class="w-full">
	<slot />
</div>
