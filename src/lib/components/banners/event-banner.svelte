<script lang="ts">
	export let title = '';
	export let subtitle = '';
	export let description = '';
	export let linkText = '';
	export let linkHref = '';
	export let linkIcon: string | undefined = undefined;
	export let ctaLink = '';
	export let ctaText = '';
	export let ctaIcon: string | undefined = undefined;
	export let bannerClass = '';
	export let event : Event;

	import type { Event } from '$lib/types/event.d.ts';
	import { twMerge } from 'tailwind-merge';
	import Icon from '../icon/index.svelte';
	import { ics } from '$lib/utils/ics-download';
	
	function downloadICS(event: Event): any {
		ics(event);
	}
</script>

<div
	class="{twMerge(
		'text-gray-900 flex h-full md:min-h-64 max-h-64 md:max-h-80 bg-cover bg-no-repeat bg-white/10 p-8 rounded-lg shadow-md',
		bannerClass
	)}"
>
	<div class="max-w-[672px] flex flex-col w-full justify-end">
		<h2 class="text-2xl md:text-3xl font-bold mb-4 text-balance">{title}</h2>
		<p class="leading-[24px] sm:text-sm md:text-base dark:text-violet-100">{subtitle}</p>
		<p class="leading-[24px] sm:text-sm md:text-base dark:text-violet-300">{description}</p>
		<div class="flex gap-8 mt-3">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a on:click={downloadICS(event)}
				href="javascript:void(0)"
				target="_blank"
				rel="noopener noreferrer"
				class="gap-2.5 text-blue-500 hover:underline font-medium text-sm inline-flex items-center transition-colors"
			>
				{ctaText}
				{#if ctaIcon}
					<Icon name="{ctaIcon}" className="w-4 h-4 md:w-5 md:h-5" />
				{/if}
			</a>
			<a
				href="{linkHref}"
				target="_blank"
				rel="noopener noreferrer"
				class="gap-2.5 text-blue-500 hover:underline font-medium text-sm inline-flex items-center transition-colors"
			>
				{linkText}
				{#if linkIcon}
					<Icon name="{linkIcon}" className="w-4 h-4 md:w-5 md:h-5" />
				{/if}
			</a>
		</div>
	</div>
</div>
