<script lang="ts">
	import { Tabs, TabItem, Button, Modal, Select } from 'flowbite-svelte';
	import EditUser from '$lib/components/edit-user.svelte';
	import EditOrg from '$lib/components/edit-org.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: user = data.user;
	$: group = data.userGroup;
	const groups = data.groups?.map((g) => {
		return { value: g, name: g };
	});
	let step = 0;
</script>

{#if user?.name}
	Welcome {user.name}
{/if}

<Modal dismissable="{false}">
	{#if step === 0}
		<div class="flex flex-col items-center">
			<h1 class="text-3xl">👋 Welcome To NOLADevs</h1>
			<p>We Noticed this is the 1st time you signed in!!</p>
			<Button class="w-fit self-end" on:click="{() => step++}">Next</Button>
		</div>
	{:else if step === 1}
		<div>
			<EditUser {user} />
			<Button on:click="{() => step++}">Next</Button>
		</div>
	{:else if step === 2}
		<div>
			<h1>Does your group exist?</h1>
			<Select items="{groups}" placeholder="I don't see my group here" />
			<Button on:click="{() => step++}">Save</Button>
		</div>
	{:else if step === 3}
		<EditOrg {group} />
	{/if}
</Modal>

<Tabs>
	<TabItem open title="Organizer">
		<EditUser {user} />
	</TabItem>
	<TabItem title="Group">
		{#if !!group}
			<EditOrg {group} />
		{/if}
	</TabItem>
</Tabs>
