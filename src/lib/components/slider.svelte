<script lang="ts">
	import Banner from './banner.svelte';
	import { writable } from 'svelte/store';

	interface BannerData {
		title: string;
		description: string;
		buttonText: string;
		onButtonClick: () => void;
		buttonIcon?: string | undefined;
	}

	let banners: BannerData[] = [
		{
			title: 'We connect people to local communities',
			description:
				'Dive into engaging discussions, share your insights, and stay updated on the latest news and events. Together, we build a thriving community! Take the plunge and explore the Nola Devs Slack channel — click below!',
			buttonText: 'Join the Conversation',
			onButtonClick: () => {
				console.log('Join the Conversation');
			},
			buttonIcon: 'slackIcon',
		},
	];

	const activeIndex = writable(0);

	function setActive(index: number): void {
		activeIndex.set(index);
	}
</script>

<div class="relative min-h-96">
	{#each banners as banner, index (banner.title)}
		<div class="absolute inset-0 transition-opacity" class:hidden="{$activeIndex !== index}">
			<Banner {...banner} />
			{#if index === $activeIndex}
				<div class="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-4">
					{#each banners as _, i (i)}
						<button
							class="cursor-pointer block h-2 w-2 rounded-full bg-gray-400 focus:outline-none focus:ring"
							class:bg-white="{$activeIndex === i}"
							aria-label="{`Go to slide ${i + 1}`}"
							on:click="{() => setActive(i)}"
						></button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.hidden {
		display: none;
	}
</style>
