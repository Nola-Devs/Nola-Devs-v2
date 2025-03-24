<script lang="ts">
import {  P, Button } from 'flowbite-svelte';
import { ScaleOut, Circle2 } from 'svelte-loading-spinners';
import { onMount } from 'svelte';
import Icon from '$lib/components/icon/index.svelte';
import Banner from '$lib/components/banners/group-banner.svelte';
import ScaleIcon from '$lib/assets/icons/ScaleIcon.svelte';

const TEMP_DINGDONG_ENDPOINT = 'http://127.0.0.1:8080';

// VARIABLES REPRESENTING SERVER AND SERVER INTERACTION
let isOnline: boolean | null = null;
let isClicked: boolean = false;
let isDingDongTurnedOn: boolean | null = null;
let isDingDongRequestFailed: boolean | null = null;
let isSomeoneComing: boolean | null = null;

// VARIABLES REPRESENTING UI
type ButtonState = 'Slack' | 'DingDong' | 'ScaleOut' | 'Circle2' | null;
let buttonState: ButtonState = null;
let bodyText: string = '';

// REACTIVE BANNER DESCRIPTION
$: bannerDescription = (() => {
    if (isOnline === null) return "Checking status...";
    if (isOnline === false) return "Ding Dong's server is offline.";
    return "Are you locked out of Scale?";
})();

// REACTIVE BODY TEXT, BUTTON STATE
$: {
	switch (true) {
		case isSomeoneComing === true: // someone is on their way to let you in
			bodyText = 'Someone is on their way to let you in!';
			buttonState = null;
			break;
		case isSomeoneComing === false: // ding dong request went through but no one has responded in five minutes
			bodyText = "Ding Dong has been active for a couple minutes and no one has responded...\n" +
				"You might want to contact someone in slack to let them know you are outside.";
			buttonState = 'Slack';
			break;
		case isDingDongTurnedOn === true: // ding dong light is on, waiting for someone to respond
			bodyText = 'Your request went through. Wait a minute or so for someone to respond...';
			buttonState = 'Circle2';
			break;
		case isDingDongRequestFailed === true: // ding dong request did not go through
			bodyText = "Ding Dong's request failed.\n" + "Contact someone in slack to let them know you're outside.";
			buttonState = 'Slack';
			break;
		case isClicked === true: // waiting for feedback from server
			bodyText = '';
			buttonState = 'ScaleOut';
			break;
		case isOnline === true: // no user interaction yet, server is online
			bodyText = 'Click here to let someone know you are outside.';
			buttonState = 'DingDong'
			break;
		case isOnline === false: // server is online
			bodyText = "Contact someone in slack to let them know you're outside.";
			buttonState = 'Slack'
			break;
		case isOnline === null: //also the starting state, waiting for user interaction
			bodyText = '';
			buttonState = null;
			break;
	}
}

// async function checkServerStatus(retries = 3, delay = 2000, attempt = 1) {
// 	if (attempt >= retries) {
// 		console.log(`Request failed after ${retries} attempts`);
// 		return false;
// 	}

// 	try {
// 		const response = await fetch('url'); // Replace with API endpoint
// 		if (response.ok) return true;
// 		else console.log(`Request failed with status: ${response.status}`);	
// 	} catch (error) {
// 		console.error(`Request failed with error:`, error);
// 	}

// 	console.log(`Retries left: ${retries - attempt}.`);
// 	await new Promise(resolve => setTimeout(resolve, delay));
// 	return await checkServerStatus(retries, delay, attempt + 1);
// }

onMount(() => {
	// checkServerStatus();
	cycleDisplayStates();
});

function handleClick() {
	isClicked = true;
// 	// make Ding Dong request with retries
// 	// if success, show waiting for someone message
// 	// if fail, show error message
}

// async function dingDong() {
// 	if (isClicked) return;
// 	try {
// 		// const resp = await fetch(TEMP_DINGDONG_ENDPOINT + '/dingDong', {
// 		// 	method: 'POST',
// 		// 	body: JSON.stringify({ isAuthorizedLOL: true })
// 		// });
// 		// const { success } = await resp.json();
// 		// if (!success) isDingDongSuccess = false;
// 		// isDingDongSuccess = true;
// 	} catch (err) {
// 		console.error(err);
// 		isDingDongSuccess = false;
// 	}
// }

async function cycleDisplayStates(delay = 2000) {
	// Utility function to make sure the various display states look okay
	
	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isOnline = false;")
	isOnline = false;
	
	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isOnline = true;")
	isOnline = true;

	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isClicked = true;")
	isClicked = true;

	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isDingDongRequestFailed = true;")
	isDingDongRequestFailed = true;

	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isDingDongTurnedOn = true;")
	isDingDongTurnedOn = true;

	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isSomeoneComing = false;")
	isSomeoneComing = false;

	await new Promise(resolve => setTimeout(resolve, delay));
	console.log("isSomeoneComing = true;")
	isSomeoneComing = true;
}

</script>


<div class="flex flex-col gap-6 flex-1 relative">
	<div class="relative w-fit overflow-hidden w-full justify-center align-center flex">
		<Banner
			title="Ding Dong"
			description={bannerDescription}
			bannerClass="bg-scaleBanner text-white relative w-full"
		/>
		<ScaleIcon class="absolute md:opacity-30 md:scale-[.8] md:left-0 sm:scale-[1.2] opacity-[0.08] scale-[1.2] top-5" />
	</div>
</div>

<div class="grid grid-rows-2 place-items-center h-full mt-4 w-50">
	<div class="flex flex-col items-center gap-4">
		
		<!-- TEXT -->
		 {#each bodyText.split('\n') as line}
			<P>{line}</P>
		{/each}

		<!-- BUTTON -->
		{#if buttonState === "Slack"}
			<a
				href="https://join.slack.com/t/nola/shared_invite/zt-31zf5522p-QgwI5Mca_he6jku5xfGVlA"
				target="_blank"
				rel="noopener noreferrer"
				class="bg-white dark:border-white hover:bg-gray-200 gap-2.5 border text-gray-900 font-medium py-1.5 md:py-2 px-3 rounded-lg text-sm md:text-base shadow-sm inline-flex items-center transition-colors"
			>
				<Icon name="slackIcon" className="w-4 h-4 md:w-5 md:h-5" />
				Community Slack
			</a>
		{:else if buttonState !==null}
			<Button id="dingDong" 
				class="mt-4 w-40 h-14 active:dark:bg-primary-800 hover:dark:bg-primary-700
				{isClicked ? 'dark:bg-primary-800 hover:dark:bg-primary-800 cursor-default' : ' hover:dark:bg-primary-700 dark:bg-primary-600'}" 
				on:click="{isClicked ? () => {} : handleClick}"
			>
				{#if buttonState === "DingDong"}
					Ding Dong
				{:else if buttonState === "ScaleOut"}
					<ScaleOut size="50" color="#a855f7" unit="px" duration="1.2s" />
				{:else if buttonState === "Circle2"}
					<Circle2 size="50" colorOuter="#a855f7" colorInner="#c084fc" colorCenter="#d8b4fe" unit="px" durationOuter="1.2s" />
				{/if}
			</Button>
		{/if}

		<!-- LOADER -->
		{#if isOnline === null}
			<ScaleOut size="70" color="#a855f7" unit="px" duration="1.2s" />
		{/if}

	</div>
</div>