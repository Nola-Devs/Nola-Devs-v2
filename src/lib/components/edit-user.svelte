<script lang="ts">
	import { Button, Label, Input, Helper, Fileupload } from 'flowbite-svelte';
	import type { User } from '$lib/types/user.d.ts';

	export let user: User;
	let links = [''];
	const addLink = () => {
		links = [...links, ''];
	};
</script>

<form action="?/editUser" method="post" class="flex flex-col gap-3">
	<div>
		<Label for="name">Name *</Label>
		<Input type="text" name="name" placeholder="{user.name}" value="{user.name}" required />
	</div>
	<div>
		<Label for="with_helper">Upload Your Profile Picture</Label>
		<Fileupload class="after:rounded" name="pfp" />
		<Helper>PNG, JPG</Helper>
	</div>
	<div class="flex flex-col gap-2">
		<h3>Links</h3>
		{#if user.links}
			{#each Object.values(user.links) as link, i}
				<div>
					<Input name="{'link' + i}" type="url" value="{link}" />
				</div>
			{/each}
		{/if}
		{#each links as link, i}
			<div>
				<Input name="{'link' + i}" type="url" value="{link}" />
			</div>
		{/each}

		<Button class="w-fit" on:click="{addLink}">Add Link</Button>
	</div>
	<Button class="w-fit m-3 self-end" type="submit">Save</Button>
</form>
