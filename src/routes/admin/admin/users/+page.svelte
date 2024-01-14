<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: users = data.users;
</script>

<form action="?/addUser" method="post">
	<label for="email"
		>Email:
		<input type="email" name="email" />
	</label>
	<label for="role"
		>Role:
		<input type="text" name="role" />
	</label>
	<label for="password"
		>Password
		<input type="password" name="password" />
	</label>
	<button type="submit">Add User</button>
</form>

{#each users as user}
	<div>
		{user.email}
		{user.role}
	</div>
{/each}

users deep

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: fit-content;
		margin: 10px;
	}
</style>
