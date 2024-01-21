<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	console.log(data);
</script>

{JSON.stringify(data)}

<form action="">
	<Label for="first_name" class="mb-2">First name</Label>
	<Input type="text" id="first_name" placeholder="John" required />
</form>
