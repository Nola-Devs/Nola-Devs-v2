<script lang="ts">
	import { Img, P, A } from 'flowbite-svelte';
	import type { User } from '$lib/types/user.d.ts';
	import IconParser from './icon-parser.svelte';

	export let organizers: User[];
</script>

<div class="grid grid-cols-2 w-fit gap-2">
	{#each organizers as organizer}
		<div class="w-fit">
			{#if organizer.pfp}
				<Img src="{organizer.pfp}" />
			{:else}
				<Img
					imgClass="w-32 rounded"
					src="https://3etagenleben.de/wp-content/uploads/2019/03/blank-profile-picture-973460-e1554219898755.png"
				/>
			{/if}
			<P class="text-center">
				{organizer.name}
			</P>
			<div class="flex gap-2 justify-center">
				{#each Object.keys(organizer.links) as link}
					<A href="{organizer.links[link]}">
						<IconParser icon="{link}" size="{15}" />
					</A>
				{/each}
			</div>
		</div>
	{/each}
</div>
