<script lang="ts">
	import { GroupNames } from '$data';
		
</script>

{#each GroupNames as group}
	<a href="/group={group}">
		<p>
			{group}
		</p>
	</a>
{/each}
<slot />
