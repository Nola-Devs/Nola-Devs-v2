<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import MobileMenu from '$lib/components/mobile.svelte';
	import LogoWide from '$lib/assets/icons/Logo-wide.svelte';
	import { Card } from 'flowbite-svelte';
	export let groups: string[];
</script>

<!--
	TODO: Implement a seach Feature
	<div>
		<Input class="w-full" placeholder="Search Nola Devs">
			<SearchOutline slot="left" class="w-4 h-4" />
		</Input>
	</div>
	-->
<a href="/">
	<LogoWide styles="w-34 h-12 m-0 top-1 left-1 fixed " />
</a>

<Sidebar {groups} />

<MobileMenu {groups} />
