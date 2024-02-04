<script lang="ts">
	import { Button, Card, Input, Label, Select } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: users = data.users;
	$: userMode = users.map((e) => false);
	let roles = [
		{ value: 'organizer', name: 'Organizer' },
		{ value: 'admin', name: 'Admin' }
	];
</script>

<Card class="mx-auto my-10 ">
	<form action="?/addUser" method="post" class="items-center flex flex-col gap-3 w-full">
		<div class="w-full">
			<Label for="email">Email:</Label>
			<Input type="email" name="email" />
		</div>
		<div class="w-full">
			<Label for="password">Password</Label>
			<Input type="password" name="password" />
		</div>

		<div class="w-full">
			<Label for="permssions">Role</Label>
			<Select name="role" items="{roles}" />
		</div>

		<Button type="submit">Add User</Button>
	</form>
</Card>

<div class="flex flex-wrap w-full gap-3 justify-center">
	{#each users as user, i}
		<Card class="user ">
			<Button class="w-fit mb-3" on:click="{() => (userMode[i] = !userMode[i])}"
				>{userMode[i] ? 'Cancel' : 'Edit'}</Button
			>
			{#if !userMode[i]}
				<p>{user.name}</p>
				<p>{user.email}</p>
				<p>{user.role}</p>
			{:else}
				<form method="post" class="flex flex-col gap-3">
					<div class="w-full">
						<Label for="email">Email:</Label>
						<Input type="email" name="email" value="{user.email}" placeholder="{user.email}" />
					</div>
					<div class="w-full">
						<Label for="role">Role</Label>
						<Select name="role" items="{roles}" />
					</div>
					<div class="w-full">
						<Label for="name">Name:</Label>
						<Input type="text" name="name" placeholder="{user.name}" value="{user.name}" />
					</div>
					<div class="w-full">
						<Label for="password">Password:</Label>
						<Input type="password" name="password" />
					</div>
					<div class="w-full">
						<Button class="w-fit" formaction="?/editUser" type="submit">Save</Button>
						<Button class="w-fit" formaction="?/removeUser">Remove User</Button>
					</div>
				</form>
			{/if}
		</Card>
	{/each}
</div>
