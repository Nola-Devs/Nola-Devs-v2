<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: group = data.group;
</script>


<h1>
  {group.group}
</h1>

{#each group.organizers as organizer}
  <a href="/admin/{group.group.replace(/ /g, '-')}/{organizer.name.replace(/ /g, '-')}">
    {organizer.name}
  </a>
{/each}