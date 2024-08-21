<script lang="ts">
	import { Heading, P, Card, Avatar } from 'flowbite-svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import IconParse from '$lib/components/icon-parser.svelte';
	export let data: PageData;
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">About Nola Devs</Heading>

	<P
		>We're an open-source community of passionate developers, designers, entrepreneurs, and
		enthusiasts like you.</P
	>

	<P
		>No matter your skill level, NOLA Devs is your place to grow. We believe in collaboration,
		learning, and pushing the boundaries of what is possible. Here, you'll find a supportive network
		where you can share knowledge, explore ideas, and make new friends who share your geeky
		passions. Together, we're shaping the future of tech in New Orleans. Join us to connect, create,
		and take your tech journey to the next level.</P
	>

	<!-- TODO add Core NOLA Dev Team 
		<Heading tag="h2">The NOLA Devs Team</Heading> 
	-->

	<Heading tag="h2">Nola Devs Contributors</Heading>
	<div class="flex flex-wrap justify-center">
		{#each data.contributorsList as person}
			<a href="{person.html_url}">
				<div
					class="border rounded p-1 grid grid-cols-[50px_150px_50px] items-center duration-75 hover:scale-105 m-2"
				>
					<Avatar src="{person.avatar_url}" />
					<P>
						{person.login}
					</P>
					<P class="justify-self-end">
						{person.contributions}
					</P>
				</div>
			</a>
		{/each}
	</div>
	<Heading tag="h2">Community Organizers</Heading>
	<div class="flex flex-wrap justify-center">
		{#each data.organizers as { name, pfp, email, links, group }}
			<div
				class="border rounded p-1 grid grid-cols-[75px_175px] items-center duration-75 hover:scale-105 m-2"
			>
				{#if !pfp}
					<img
						class="w-15 h-15 rounded"
						src="/images/organizers/default-pfp.webp"
						alt="Organizer 1"
					/>
				{:else}
					<img class="w-15 h-15 rounded" src="{pfp}" alt="Organizer 1" />
				{/if}
				<div class="flex flex-col gap-1 ml-2">
					<p class="text-base text-gray-800 dark:text-white">{name}</p>
					<p class="text-base text-gray-800 dark:text-white">{group}</p>
					<div class="flex gap-3 items-center dark:text-white">
						<a href="mailto:{email}">
							<Icon name="mailIcon" size="{18}" viewBox="0 0 23 16" />
						</a>
						{#each Object.entries(links) as [link, url]}
							<a href="{url}" target="_blank">
								<IconParse icon="{link}" />
							</a>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
