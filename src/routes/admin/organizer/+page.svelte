<script lang="ts">
	import { Tabs, TabItem, Input, Label, Fileupload, Helper, Button } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: user = data.user;
	$: group = data.userGroup;
</script>

{#if user?.name}
	Welcome {user.name}
{/if}

<Tabs>
	<TabItem open title="Organizer">
		<form action="?/editUser" method="post" class="flex flex-col p-5">
			<Label for="name" class="mb-2">Name</Label>
			<Input type="text" name="name" placeholder="{user?.name}" />

			<Label for="name" class="mb-2">Group</Label>
			<Input type="text" name="group" placeholder="{user?.group}" />

			<Label for="with_helper" class="pb-2">Upload file</Label>
			<Fileupload name="pfp" class="mb-2" />
			<Helper>SVG, PNG, JPG or GIF (MAX. 800x400px).</Helper>

			<Label for="links" class="mb-2">Organizer's Links</Label>
			<Input type="text" id="links" placeholder="{user?.links}" />

			<Button class="w-fit m-3" type="submit">Save</Button>
		</form>
	</TabItem>
	<TabItem title="Group">
		<form action="?/editOrg">
			<Label for="groupName">Group Name</Label>
			<Input type="text" id="groupName" placeholder="{group?.group}" required />

			<Label for="about">About</Label>
			<Input type="text" id="about" placeholder="{group?.about}" required />

			<Label for="groupName">Google Calendar ID</Label>
			<Input type="text" id="groupName" placeholder="{group?.name}" required />

			<Label for="groupName">Organization's Links</Label>
			<Input type="text" id="groupName" placeholder="{user?.links}" required />

			<Button class="w-fit m-3" type="submit">Save</Button>
		</form>
	</TabItem>
</Tabs>
