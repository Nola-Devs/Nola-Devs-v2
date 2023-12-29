<script lang="ts">
	import type { PageData } from './$types';
	import type { ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: data;
	$: form;
</script>

{#if !form?.success}
	<form action="?/login" method="post">
		<input type="password" name="password" id="" />
		<button type="submit">login</button>
	</form>
{:else}
	TEST
{/if}
