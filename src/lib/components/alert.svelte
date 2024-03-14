<script context="module" lang="ts">
    export enum AlertType {
      Update = 'update',
      Emergency = 'emergency',
      News = 'news'
    }
  </script>

<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	export let type: AlertType = AlertType.Update;
	export let message = '';
	export let link = '';
	export let linkText = '';

	let colorClass = '';
	let hoverTextColorClass = '';

	$: {
		switch (type) {
			case AlertType.Update:
				colorClass = 'bg-yellow-300 text-gray-900';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			case AlertType.Emergency:
				colorClass = 'bg-red-[#C81E1E] text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			case AlertType.News:
				colorClass = 'bg-green-[#046C4E] text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			default:
				colorClass = 'bg-gray-500 text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
		}
	}
</script>

<Alert class="{`${colorClass} text-sm`}" dismissable transition="{fly}" params="{{ x: 200 }}">
	<InfoCircleSolid slot="icon" class="w-4 h-4" />
	{@html message}
	{#if link && linkText}
		<a href="{link}" class="{`font-semibold underline text-[#0B84FE] ${hoverTextColorClass}`}">
			{linkText}
		</a>
	{/if}
</Alert>
