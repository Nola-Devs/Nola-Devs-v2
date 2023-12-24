<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: group = data;
</script>


<h1>
  {JSON.stringify(group.organizer)}
</h1>
