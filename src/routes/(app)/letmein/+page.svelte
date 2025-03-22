<script lang="ts">
	import { Heading, P, Input, Label, A, Button, Textarea } from 'flowbite-svelte';
	import { ScaleOut, Circle2 } from 'svelte-loading-spinners';
	import { onMount } from 'svelte';

	const TEMP_DINGDONG_ENDPOINT = 'http://127.0.0.1:8080';

	let isOnline: boolean | null = null;
	let isClicked: boolean = false;
	let isDingDongSuccess: boolean | null = null;
	let isSomeoneComing: boolean | null = null;

	// Do we want a 3x retry system?

	onMount(() => {
		// check if its online
		// if its Online, set isOnline to false
		// if its online, set isOnline to true
		isOnline = true;
		isClicked = true;
		isDingDongSuccess = true;
		isSomeoneComing = false;
		setTimeout(() => isOnline = true, 2000);
	})

	async function dingDong() {
		if (isClicked) return;
		try {
			// isClicked = true;
			// setTimeout(() => isDingDongSuccess = true, 2000);
			// setTimeout(() => isSomeoneComing = true, 4000);
			return true;
			// const resp = await fetch(TEMP_DINGDONG_ENDPOINT + '/dingDong', {
			// 	method: 'POST',
			// 	body: JSON.stringify({ isAuthorizedLOL: true })
			// });
			// const { success } = await resp.json();
			// if (!success) isDingDongSuccess = false;
			// isDingDongSuccess = true;
		} catch (err) {
			console.error(err);
			isDingDongSuccess = false;
		}
	}

	const Global = {
		dingDong
	};
</script>

<div class="flex flex-col gap-6 flex-1">
{#if isOnline === null}
	<div class="flex items-center justify-center h-full">
		<ScaleOut size="60" color="#a855f7" unit="px" duration="1.2s" />
	</div>
{:else if isOnline === false}
	<Heading tag="h1">Ding Dong is Offline</Heading>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<P>Contact an organizer to let them know you're stuck outside.</P>
	</div>
{:else}
	<div class="flex flex-col gap-6 flex-1">
		<Heading tag="h1">Are you locked out of Scale?</Heading>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<P>Click the button to let someone know you're stuck outside.</P>
		</div>
		<div class="grid grid-rows-2 place-items-center h-full mt-4 w-50">
			<!-- todo: add light mode color options :( ' -->

			<!-- 
			not isClicked?
				button
			else if isClicked?
			  isDingDongSuccess == null
				 loading (button with scaleOut)
				isDingDongSuccess == error
				  error (paragraph)
				is isDingDongSuccess == true
					isSomeoneComing == null
						Your request went through. Wait minute or so for someone to respond... (paragraph on top of button with circle2)
					isSomeoneComing == false
						Hmm, your request went through but no one has responded. You might want to contact an organizer to let you in to the building. (paragraph on top of button with circle2)
					isSomeoneComing == true
						Someone is coming to let you in! (paragraph)
			-->
			 {#if !isClicked}
				<Button id="dingDong" 
					class="mt-4 w-40 h-14 active:dark:bg-primary-800 hover:dark:bg-primary-700
					{isClicked ? 'dark:bg-primary-800 hover:dark:bg-primary-800 cursor-default' : ' hover:dark:bg-primary-700 dark:bg-primary-600'}" 
					on:click="{dingDong}"
				>
					Ding Dong
				</Button>
			 {:else if isClicked}
			 	{#if isDingDongSuccess === null}
					<Button id="dingDong" 
						class="mt-4 w-40 h-14 active:dark:bg-primary-800 hover:dark:bg-primary-700
						{isClicked ? 'dark:bg-primary-800 hover:dark:bg-primary-800 cursor-default' : ' hover:dark:bg-primary-700 dark:bg-primary-600'}" 
						on:click="{dingDong}"
					>
						<ScaleOut size="60" color="white" unit="px" duration="1.2s" />
					</Button>
				{:else if isDingDongSuccess === false}
					<div class="flex flex-col gap-4 justify-center items-center">
						<P>Something went wrong with Ding Dong.</P>
						<P>Contact an organizer to let you in.</P>
					</div>
				{:else if isDingDongSuccess === true}
					{#if isSomeoneComing === null}
						<P>The Ding Dong light is on!</P>
						<Circle2 size="60" colorOuter="#9333ea" colorInner="#6b21a8" colorCenter="#a855f7" unit="px" durationOuter="1.2s" />
						<P>Wait minute or so for someone to respond...</P>
					{:else if isSomeoneComing === false}
					<div class="flex flex-col gap-4 justify-center items-center">
						<P>Hmmm, the Ding Dong has been on for a while... but no one has responded.</P>
						<Circle2 size="60" colorOuter="#9333ea" colorInner="#6b21a8" colorCenter="#a855f7" unit="px" durationOuter="1.2s" />
						<P>You might want to contact an organizer to let you in to the building.</P>
						</div>
					{:else if isSomeoneComing === true}
						<P>Someone is coming to let you in!</P>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
{/if}
</div>
