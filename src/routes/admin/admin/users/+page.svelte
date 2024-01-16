<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: users = data.users;
	$: userMode = users.map((e) => false);
</script>

<form action="?/addUser" method="post">
	<label for="email"
		>Email:
		<input type="email" name="email" />
	</label>
	<label for="role"
		>Role:
		<select name="role">
			<option value="organizer">Organizer</option>
			<option value="dev">Dev Team</option>
			<option value="admin">Admin</option>
		</select>
	</label>
	<label for="password"
		>Password
		<input type="password" name="password" />
	</label>
	<button type="submit">Add User</button>
</form>

{#each users as user, i}
	<div class="user">
		<button on:click="{() => (userMode[i] = !userMode[i])}">Edit</button>
		{#if !userMode[i]}
			{user.email}
			{user.role}
		{:else}
			<form action="?/editUser" method="post">
				<label for="email">
					Email:
					<input type="text" name="email" value="{user.email}" placeholder="{user.email}" />
				</label>
				<label for="role">
					Role:
					<select name="role">
						<option selected="{user.role === 'organizer'}" value="organizer">Organizer</option>
						<option selected="{user.role === 'dev'}" value="dev">Dev Team</option>
						<option selected="{user.role === 'admin'}" value="admin">Admin</option>
					</select>
				</label>
				<label for="name">
					Name:
					<input type="text" name="name" placeholder="{user.name}" value="{user.name}" />
				</label>
				<button type="submit">Save</button>
				<button formaction="?/removeUser">X</button>
			</form>
		{/if}
	</div>
{/each}

<style>
	.user {
		display: flex;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: fit-content;
		margin: 10px;
	}
	button {
		width: fit-content;
	}
</style>
