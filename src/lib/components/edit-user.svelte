<script lang="ts">
	import { Button, Label, Input, Helper, Fileupload } from 'flowbite-svelte';
</script>

<form action="?/editUser" method="post" class="flex flex-col gap-3">
	<div>
		<Label for="name">Name</Label>
		<Input type="text" name="name" />
	</div>
	<div>
		<Label for="with_helper">Upload file</Label>
		<Fileupload name="pfp" />
		<Helper>PNG, JPG</Helper>
	</div>
	<div class="flex flex-col gap-2">
		<div>
			<Label>LinkedIn</Label>
			<Input name="linkedin" type="url" placeholder="url" />
		</div>
		<div>
			<Label>Github</Label>
			<Input name="gihub" type="url" placeholder="url" />
		</div>
		<div>
			<Label>Twitter/X</Label>
			<Input name="x" type="url" placeholder="url" />
		</div>
		<div>
			<Label>Website</Label>
			<Input name="website" type="url" placeholder="url" />
		</div>
	</div>
	<Button class="w-fit m-3" type="submit">Save</Button>
</form>
