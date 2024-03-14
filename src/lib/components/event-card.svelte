<script lang="ts">
	import type { Event } from '$types';

	export let event: Event;

	const { group, summary, start, end, location } = event;

	const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(' ', ''); // Remove the space before AM/PM
  };

  const startDateTime = new Date(start);
  const endDateTime = new Date(end);

  const isSameDay = startDateTime.toDateString() === endDateTime.toDateString();

  const formattedDate = formatDate(startDateTime);
  const formattedStartTime = formatTime(startDateTime);
  const formattedEndTime = formatTime(endDateTime);

  const dateTimeDisplay = isSameDay
    ? `${formattedDate} • ${formattedStartTime} - ${formattedEndTime}`
    : `${formatDate(startDateTime)} • ${formattedStartTime} • ${formatDate(endDateTime)} • ${formattedEndTime}`;
</script>

<article>
	<div class="rounded-lg bg-white dark:bg-white/10 shadow-sm p-4 space-x-3 max-h-[200px] h-full">
		<span class="px-3 py-1 text-gray-900 font-medium text-sm rounded-md bg-gray-100 dark:bg-violet-500 dark:text-violet-100">Today</span>
		<span class="px-3 py-1 text-gray-900 font-medium text-sm rounded-md bg-gray-100 dark:bg-violet-500 dark:text-violet-100">Weekly</span>
	</div>
	<div class="p-4">
		<h3 class="text-3xl font-bold text-gray-900 dark:text-violet-100">{summary}</h3>
		<p class="text-lg font-semibold text-gray-600 dark:text-violet-300">{group}</p>
		<p class="text-base text-gray-500 dark:text-violet-50">{dateTimeDisplay}</p>

		{#if /^(http|https):\/\/[^ "]+$/.test(location)}
			<a href="{location}" class="text-base text-gray-500 dark:text-violet-50">Virtual</a>
		{:else}
			<p class="text-base text-gray-500 dark:text-violet-50">
				{location.split(',')[0]}
			</p>
		{/if}
	</div>
</article>

