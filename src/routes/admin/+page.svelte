<script>
	import { Input, Select, Label, Button, Card } from 'flowbite-svelte';

	let roles = [
		{ value: 'organizer', name: 'Organizer' },
		{ value: 'admin', name: 'Admin' }
	];
</script>

<div class="h-screen w-full p-auto">
	<Card class="m-auto ">
		<form
			action="?/login"
			method="post"
			id="loginForm"
			autocomplete="on"
			class="items-center flex flex-col gap-3"
		>
			<div class="w-full">
				<Label for="email">Email</Label>
				<Input
					autocomplete="email"
					type="email"
					name="email"
					value=""
					placeholder="organizer@noladevs.org"
					required
				/>
			</div>
			<div class="w-full">
				<Label for="password">Password</Label>
				<Input
					autocomplete="current-password"
					type="password"
					placeholder="password"
					name="password"
					value="•••••"
					required
				/>
			</div>
			<div class="w-full">
				<Label for="role">Role</Label>
				<Select name="role" items="{roles}" required />
			</div>
			<Button class="w-fit self-end" type="submit" value="LogIn">Log In</Button>
		</form>
	</Card>
</div>
