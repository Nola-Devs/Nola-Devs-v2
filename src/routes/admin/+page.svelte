<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
</script>

<div class="h-screen w-full p-auto">
	<Card class="m-auto">
		<div class="flex flex-col gap-4 items-center p-4">
			<h1 class="text-xl font-semibold">Admin sign in</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300 text-center">
				Use your GitHub account to sign in. Access is granted by a super admin.
			</p>
			<Button href="/login/github" class="w-full">Sign in with GitHub</Button>
		</div>
	</Card>
</div>
