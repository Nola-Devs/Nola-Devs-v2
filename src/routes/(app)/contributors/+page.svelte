<script lang="ts">
	import { P, Avatar, Heading, A, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col gap-2 w-96 mx-auto">
	<Heading class="text-center">Leader Board</Heading>
	<div class="grid grid-cols-[200px_50px]">
		<P>Contributor</P>
		<P>Contributions</P>
	</div>

	{#each data.contributorsList as person}
		<div id="card" class="duration-200 hover:shadow-lg">
			<Card href="{person.html_url}" size="sm" class="hover:bg-slate-900">
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
		</div>
	{/each}
</div>

<style>
	#card:hover {
		scale: 1.04;
	}
</style>
