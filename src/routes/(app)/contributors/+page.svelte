<script lang="ts">
	import { P, Avatar, Heading, A, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col gap-2 w-96 mx-auto">
	<Heading class="text-center">Leaderboard</Heading>
	<div class="grid grid-cols-[200px_50px]">
		<P>Contributor</P>
		<P>Contributions</P>
	</div>

	{#each data.data as person}
		<Card>
			<div class="grid grid-cols-[50px_150px_50px] items-center">
				<Avatar src="{person.avatar_url}" />
				<P>
					{person.login}
				</P>
				<P class="justify-self-end">
					{person.contributions}
				</P>
			</div>
		</Card>
	{/each}
</div>
