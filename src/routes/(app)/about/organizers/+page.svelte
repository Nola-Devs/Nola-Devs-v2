<script lang="ts">
	import { Heading, P, Img, A } from 'flowbite-svelte';
	import IconParser from '$lib/components/icon-parser.svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Organizers</Heading>

	<P>
		The New Orleans tech community thrives thanks to amazing organizers who generously share their
		knowledge, spark opportunities, and connect us all!
	</P>

	<div
		class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center gap-4"
	>
		<div class="flex flex-col items-center min-w-32 w-32">
			<Img
				imgClass="w-32 rounded"
				src="https://3etagenleben.de/wp-content/uploads/2019/03/blank-profile-picture-973460-e1554219898755.png"
			/>

			<P>Jorge Cavajal</P>

			<P class="text-gray-800 dark:text-gray-300">Front End Party</P>

			<div class="flex gap-2 justify-center">
				<A href="https://github.com/codingmustache">
					<IconParser icon="github" size="{15}" />
				</A>
			</div>
		</div>
	</div>
</div>
