<!-- <script lang="ts">
	import { Tabs, TabItem, Button, Modal, Select, P } from 'flowbite-svelte';
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
	<P class="m-2">
		Welcome {user.name}
	</P>
{/if}

<Modal open="{!user.group}" dismissable="{true}">
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
		<div class="max-w-2xl mx-auto">
			<EditUser {user} />
		</div>
	</TabItem>
	<TabItem title="Group">
		<EditOrg {group} />
	</TabItem>
</Tabs> -->
