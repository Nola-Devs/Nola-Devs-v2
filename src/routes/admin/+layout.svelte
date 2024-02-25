<script lang="ts">
	import '/src/app.css';
	import { DarkMode } from 'flowbite-svelte';
	import LOGO from '$lib/assets/icons/Logo-wide.svelte';
</script>

<div class="flex justify-between">
	<div class="h-8 w-36 m-4">
		<a href="/">
			<LOGO />
		</a>
	</div>
	<div class="h-fit my-auto m-3">
		<DarkMode />
	</div>
</div>
<div class="w-full">
	<slot />
</div>
