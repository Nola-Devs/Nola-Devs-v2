<script lang="ts">
	import { Heading, P, Img, A } from 'flowbite-svelte';
	import IconParser from '$lib/components/icon-parser.svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">Contributors</Heading>

	<P>
		The success of our open-source community is made possible by the collaborative efforts and
		valuable contributions of numerous dedicated individuals working together as a cohesive team.
		Without their unwavering commitment, our achievements would not be attainable.
	</P>

	<div class="grid grid-cols-1 md:grid-cols-2 w-fit gap-6 w-full">
		<div class="flex flex-col gap-4">
			<Heading tag="h2">Contributor List</Heading>

			<div class="flex flex-col gap-4">
				<!-- Card -->
				<div class="w-fit flex gap-4">
					<Img
						imgClass="w-16 rounded"
						src="https://3etagenleben.de/wp-content/uploads/2019/03/blank-profile-picture-973460-e1554219898755.png"
					/>

					<div>
						<P>Jorge Cavajal</P>

						<A href="https://github.com/codingmustache">
							<IconParser icon="github" size="{15}" />
						</A>
					</div>
				</div>
			</div>
		</div>

		<div>
			<Heading tag="h2">Leaderboard</Heading>
		</div>
	</div>
</div>
