<script lang="ts">
	import type { Event } from '$types';

	export let event: Event;

	const { group, summary, start, end, location } = event;

	const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const startFormatted = formatDate(new Date(start));
  const endFormatted = formatDate(new Date(end));
</script>

<article>
	<div class="rounded-lg bg-[#E8E8E8] shadow-sm p-4 space-x-3 max-h-[200px] h-full">
		<span>Today</span>
		<span>Weekly</span>
	</div>
	<div>
		<h3>{summary}</h3>
		<p>{group}</p>
		<p>{startFormatted} • {endFormatted}</p>

		{#if /^(http|https):\/\/[^ "]+$/.test(location)}
			<a href="{location}">Virtual</a>
		{:else}
			<p>
				{location.split(',')[0]}
			</p>
		{/if}
	</div>
</article>

