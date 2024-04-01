<script lang="ts">
	import { Heading, P, Img, A } from 'flowbite-svelte';
	import IconParser from '$lib/components/icon-parser.svelte';
</script>

<div class="flex flex-col gap-6 flex-1">
	<Heading tag="h1">About Nola Devs</Heading>

	<P>
		We're an open-source community of passionate developers, designers, entrepreneurs, and
		enthusiasts like you. Our mission is simple — support the growth of the New Orlean’s tech
		ecosystem by creating more visibility for local innovators, networking events, and opportunities
		to both teach and learn.
	</P>

	<P>
		No matter your background or skill level, we welcome you with open arms! We believe in the power
		of collaboration to push boundaries and achieve incredible things. So, join us, learn from each
		other, and let's shape the future of tech in New Orleans together!
	</P>

	<Heading tag="h2">Site Team</Heading>

	<div>
		<div class="flex flex-col items-center min-w-32 w-32">
			<Img
				imgClass="w-32 rounded"
				src="https://3etagenleben.de/wp-content/uploads/2019/03/blank-profile-picture-973460-e1554219898755.png"
			/>

			<P>Jorge Cavajal</P>

			<P class="text-gray-800 dark:text-gray-300">Project Lead</P>

			<div class="flex gap-2 justify-center">
				<A href="https://github.com/codingmustache">
					<IconParser icon="github" size="{15}" />
				</A>
			</div>
		</div>
	</div>

	<div class="grid-cols-1 grid md:grid-cols-2 w-fit gap-8">
		<div class="flex flex-col gap-4">
			<Heading tag="h2">Organizers</Heading>

			<P>
				Community leaders work tirelessly behind the scenes to create events, workshops, and
				resources for everyone.
			</P>

			<P>See who they are <A href="/about/organizers">here</A>.</P>
		</div>

		<div class="flex flex-col gap-4">
			<Heading tag="h2">Contributors</Heading>
			<P>
				From sharing their expertise to helping with logistics, these awesome people make the magic
				happen.
			</P>

			<P>Meet them all <A href="/about/contributors">here</A>.</P>
		</div>
	</div>
</div>
