<script lang="ts">
	import { icons, type IconName } from './icons';

	export let name: IconName;
	export let size: number = 32;
	export let viewBox: string = '0 0 24 24';
	export let className: string = '';
	export let ariaHidden: boolean = false;

	function getPathData(iconName: IconName) {
		return icons[iconName] || '';
	}

	$: pathData = getPathData(name);
</script>

{#if pathData}
	<svg
		class="{className}"
		xmlns="http://www.w3.org/2000/svg"
		width="{size}"
		height="{size}"
		{viewBox}
		fill="none"
		aria-hidden="{ariaHidden}"
	>
		<!-- eslint-disable svelte/no-at-html-tags -->
		{@html pathData}
	</svg>
{/if}
