<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<nav>
	<a href="/admin"> admin </a>
	{#each data.groups as group}
		<a href="/admin/{group?.replace(/ /g, '-')}">
			<p>{group}</p>
		</a>
	{/each}
	<a href="/admin/page-admin">
		<p>Site Admin</p>
	</a>
</nav>

<slot />
