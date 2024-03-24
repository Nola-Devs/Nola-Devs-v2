<script lang="ts">
	import type { Event } from '$lib/types/event.d.ts';
	import Icon from '$lib/components/icon/index.svelte';

	export let event: Event;

	const { group, groupSlug, eventSlug, summary, start, end, location } = event;

	const startDateTime = new Date(start);
	const endDateTime = new Date(end);

	const isSameDay = startDateTime.toDateString() === endDateTime.toDateString();

	function formatDateComponents(date: Date) {
		const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
		const month = date.toLocaleDateString('en-US', { month: 'long' });
		const day = date.toLocaleDateString('en-US', { day: 'numeric' });
		return { weekday, month, day };
	}
	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	};

	const formatTime = (date: Date) => {
		return date
			.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			})
			.replace(' ', '');
	};

	const { weekday, month, day } = formatDateComponents(startDateTime);
	const formattedStartTime = formatTime(startDateTime);
	const formattedEndTime = formatTime(endDateTime);

	import { groupIconsMap } from '$lib/components/icon/icons';
</script>

<a
	data-sveltekit-reload
	href="/group/{groupSlug}/events/{eventSlug}"
	class="flex px-4 py-2 justify-between items-center group"
>
	<div class="flex flex-col md:flex-row md:gap-12 w-1/2">
		<div>
			<div class="hidden md:block">
				<time class="block text-xs md:text-base font-semibold text-[#6628CC] dark:text-violet-300">
					{weekday}
				</time>
				<time class="block text-xs md:text-base font-semibold text-[#6628CC] dark:text-violet-300">
					{month}
					{day}
				</time>
			</div>
			<div class="md:hidden">
				<time class="text-sm font-semibold text-[#6628CC] dark:text-violet-300">
					{weekday}, {month}
					{day}
				</time>
			</div>
			<time class="block text-xs md:text-sm text-gray-800 dark:text-gray-300">
				{isSameDay
					? `${formattedStartTime} - ${formattedEndTime}`
					: `${formattedStartTime} - ${formatDate(endDateTime)} ${formattedEndTime}`}
			</time>
		</div>

		<div class="w-full md:w-1/2">
			<h3 class="text-sm text-balance md:text-xl font-semibold text-[#333] dark:text-violet-100">
				{summary}
				<span class="inline-flex ml-2">
					<Icon
						name="recurrenceIcon"
						className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]"
						viewBox="0 0 18 18"
					/>
				</span>
			</h3>
			<p class="text-sm md:text-base font-medium text-[#4F4F4F] dark:text-violet-300">{group}</p>

			{#if /^(http|https):\/\/[^ "]+$/.test(location)}
				<a
					href="{location}"
					class="text-sm md:text-base text-gray-500 dark:text-violet-50 hover:underline"
					>Virtual Event</a
				>
			{:else}
				<p class="text-sm md:text-base text-gray-500 dark:text-violet-50">
					{location.split(',')[0]}
				</p>
			{/if}
		</div>
	</div>

	<div
		aria-hidden="true"
		class="bg-defaultBanner w-32 h-20 md:w-[240px] md:h-[104px] bg-cover font-extrabold text-violet-50/20 group-hover:text-white flex justify-center items-center text-lg p-4 overflow-clip rounded-lg"
	>
		<span>
			<Icon
				name="{groupIconsMap[groupSlug]}"
				ariaHidden
				className="w-11 h-11 md:w-[72px] md:h-[72px] skew-x-12 group-hover:scale-110 transition-colors"
			/>
		</span>
	</div>
</a>
