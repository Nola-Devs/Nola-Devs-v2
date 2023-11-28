<script lang="ts">
	import type { PageData } from './$types';
	import type { Event, Group } from '$appTypes';

	import { EventCard, GroupCard } from '$components';

	export let data: PageData;

	$: group = data.groupObj.group as string;
	$: events = data.events as Event[];
</script>

{#key group}
	<GroupCard groupName="{group}" />
{/key}

{#if events !== undefined}
	{#key events}
		<div>
			{#each events as e}
				<EventCard event="{e}" />
			{/each}
		</div>
	{/key}
{/if}
