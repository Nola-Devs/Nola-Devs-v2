<script lang="ts">
	export let title = '';
	export let description = '';
	export let linkText = '';
	export let linkHref = '';
	export let linkIcon: string | undefined = undefined;
	export let bannerClass = '';
	import { twMerge } from 'tailwind-merge';
	import Icon from '../icon/index.svelte';
</script>

<div
	class="{twMerge(
		'text-gray-900 max-h-64 md:max-h-80 bg-cover bg-no-repeat bg-white/10 p-8 rounded-lg shadow-md',
		bannerClass
	)}"
>
	<div class="max-w-[672px]">
		<h2 class="text-2xl md:text-3xl font-bold mb-4 text-balance">{title}</h2>
		<p class="mb-8 leading-[24px] hidden sm:block sm:text-sm md:text-base dark:text-violet-300">
			{description}
		</p>
		<a
			href="{linkHref}"
			target="_blank"
			rel="noopener noreferrer"
			class="bg-white dark:border-white hover:bg-gray-200 gap-2.5 border text-gray-900 font-medium py-1.5 md:py-2 px-3 rounded-lg text-sm md:text-base shadow-sm inline-flex items-center transition-colors"
		>
			{#if linkIcon}
				<Icon name="{linkIcon}" className="w-4 h-4 md:w-5 md:h-5" />
			{/if}
			{linkText}
		</a>
	</div>
</div>
