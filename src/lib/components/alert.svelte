<script context="module" lang="ts">
	export enum AlertType {
		Update = 'update',
		Emergency = 'emergency',
		News = 'news'
	}
</script>

<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	import Icon from './icon/index.svelte';
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
				colorClass = 'bg-yellow-300 dark:bg-yellow-300 text-gray-900 dark:text-gray-900';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			case AlertType.Emergency:
				colorClass = 'bg-red-[#C81E1E] dark:bg-red-[#C81E1E] text-white dark:text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			case AlertType.News:
				colorClass = 'bg-green-[#046C4E] dark:bg-green-[#046C4E] text-white dark:text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
				break;
			default:
				colorClass = 'bg-gray-500 dark:bg-gray-500 text-white dark:text-white';
				hoverTextColorClass = 'hover:text-blue-700 dark:hover:text-blue-900';
		}
	}
</script>

<Alert class="{`${colorClass} text-sm max-sm:p-2.5`}" dismissable transition="{fly}" params="{{ x: 200 }}">
	<div
		slot="icon"
		class="w-10 h-5 sm:w-6 sm:h-6 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-900"
	>
		<Icon name="alertIcon" className="w-3 h-3 sm:w-[18px] sm:h-[18px]" viewBox="0 0 18 18" />
	</div>
	{@html message}
	{#if link && linkText}
		<a href="{link}" class="{`font-semibold underline text-[#0B84FE] ${hoverTextColorClass}`}">
			{linkText}
		</a>
	{/if}
</Alert>
