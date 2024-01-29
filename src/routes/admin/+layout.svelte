<script>
	import '/src/app.css';
	import { DarkMode } from 'flowbite-svelte';
	import LOGO from '$lib/assets/icons/Logo-wide.svelte';
</script>

<div class="flex justify-between">
	<div class="h-8 w-24 m-4">
		<a href="/">
			<LOGO />
		</a>
	</div>
	<div class="h-fit my-auto">
		<DarkMode />
	</div>
</div>

<slot />
