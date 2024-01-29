<script lang="ts">
	import { Tabs, TabItem, Input, Label, Fileupload, Helper, Button } from 'flowbite-svelte';
	import EditUser from '$lib/components/edit-user.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: user = data.user;
	$: group = data.userGroup;
	const groups = data.groups?.map((g) => {
		return { value: g, name: g };
	});
</script>

{#if user?.name}
	Welcome {user.name}
{/if}

<Tabs>
	<TabItem open="{!!groups?.length}" title="Organizer">
		<EditUser />
	</TabItem>
	<TabItem title="Group">
		<form action="?/editOrg">
			<Label for="groupName">Group Name</Label>
			<Input type="text" id="groupName" placeholder="{group?.group}" required />

			<Label for="about">About</Label>
			<Input type="text" id="about" placeholder="{group?.about}" required />

			<Label for="groupName">Google Calendar ID</Label>
			<Input type="text" id="groupName" placeholder="{group?.calID}" required />

			<Label for="groupName">Organization's Links</Label>
			<Input type="text" id="groupName" placeholder="{user?.links}" required />

			<Button class="w-fit m-3" type="submit">Save</Button>
		</form>
	</TabItem>
</Tabs>
