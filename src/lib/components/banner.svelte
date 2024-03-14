<script lang="ts">
	export let title = '';
	export let description = '';
	export let buttonText = '';
	export let onButtonClick = () => {};
	export let buttonIcon: string | undefined = undefined;
	import Icon from './icon/index.svelte';
</script>

<div class="text-gray-900 dark:text-violet-100 h-full bg-white dark:bg-white/10 p-8 rounded-lg shadow-md">
	<div class="max-w-[672px]">
		<h2 class="text-6xl font-extrabold mb-4 text-balance">{title}</h2>
		<p class="mb-8 leading-[24px] text-base dark:text-violet-300">{description}</p>
		<button
			on:click="{onButtonClick}"
			class="bg-[#6628CC] dark:bg-white dark:border-white hover:bg-purple-900 gap-2.5 border border-violet-500 text-white dark:text-gray-900 font-medium py-2 px-3 rounded-lg text-base shadow-sm inline-flex items-center transition-colors"
		>
			{#if buttonIcon}
				<Icon name={buttonIcon} size={20} />
			{/if}
			{buttonText}
		</button>
	</div>
</div>
