<script lang="ts">
	import { Label, Input, Button } from 'flowbite-svelte';

	import type { Group } from '$lib/types/group.d.ts';

	export let group: Group;

	let links = [''];
	const addLink = () => {
		links = [...links, ''];
	};
</script>

<form action="?/editOrg">
	<Label for="groupName">Group Name</Label>
	<Input type="text" id="groupName" placeholder="{group?.group}" required />
	<!-- TODO: Should be a text area and should have a limit of 500 -->
	<Label for="about">About</Label>
	<Input type="text" id="about" placeholder="{group?.about}" required />

	<Label for="groupName">Google Calendar ID</Label>
	<Input type="text" id="groupName" placeholder="{group?.calID}" required />

	<div>
		{#each links as link, i}
			<div>
				<Input name="{'link' + i}" type="url" placeholder="{link}" />
			</div>
		{/each}
		<Button class="w-fit" on:click="{addLink}">Add Link</Button>
	</div>

	<Button class="w-fit m-3" type="submit">Save</Button>
</form>
