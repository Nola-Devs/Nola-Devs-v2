<script>
	import { Input, Select, Label, Button, Card } from 'flowbite-svelte';

	let roles = [
		{ value: 'organizer', name: 'Organizer' },
		{ value: 'admin', name: 'Admin' }
	];
</script>

<div class="h-screen w-full p-auto">
	<Card class="m-auto ">
		<form action="?/login" method="post" class="items-center flex flex-col gap-3">
			<div class="w-full">
				<Label for="email">Email</Label>
				<Input type="email" name="email" placeholder="organizer@noladevs.org" required />
			</div>
			<div class="w-full">
				<Label for="password">Password</Label>
				<Input type="password" name="password" required />
			</div>
			<div class="w-full">
				<Label for="role">Role</Label>
				<Select name="role" items="{roles}" />
			</div>
			<Button class="w-fit self-end" type="submit">Login</Button>
		</form>
	</Card>
</div>
