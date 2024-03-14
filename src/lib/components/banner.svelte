<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	export let title = '';
	export let description = '';
	export let buttonText = '';
	export let onButtonClick = () => {};
	export let buttonIcon: typeof SvelteComponent | null = null;
</script>

<div class="text-gray-900 h-full bg-white p-8 rounded-lg shadow-md">
	<div class="max-w-[672px]">
		<h2 class="text-6xl font-extrabold mb-4 text-balance">{title}</h2>
		<p class="mb-8 leading-[24px] text-base">{description}</p>
		<button
			on:click="{onButtonClick}"
			class="bg-[#6628CC] hover:bg-purple-900 gap-2.5 border border-violet-500 text-white font-medium py-2 px-3 rounded-lg text-base shadow-sm inline-flex items-center transition-colors"
		>
			{#if buttonIcon}
				<svelte:component this="{buttonIcon}" />
			{/if}
			{buttonText}
		</button>
	</div>
</div>
