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
	export let event: Event;

	import type { Event } from '$lib/types/event.d.ts';
	import { twMerge } from 'tailwind-merge';
	import Icon from '../icon/index.svelte';
	import { ics } from '$lib/utils/ics-download';
	import { Button, Modal } from 'flowbite-svelte';
	let popupModal = false;

	function downloadICS(event: Event): any {
		ics(event);
	}

	function openModal(): any {
		popupModal = true;
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
			<a
				on:click="{() => openModal()}"
				href="javascript:void(0)"
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

	<Modal style="width:80%" bind:open="{popupModal}" size="xs" autoclose outsideclose>
		<div class="text-center" style="padding-top:20px">
			<Button style="margin-bottom:10px" on:click="{() => downloadICS(event)}"
				>Download Calender Event</Button
			>
			<a
				style="padding-left:37px;padding-right:37px"
				class="font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg"
				href="{ctaLink}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{ctaText}
			</a>
		</div>
	</Modal>
</div>
