<script lang="ts">
	import { browser } from '$app/environment';
	import { P, Button } from 'flowbite-svelte';
	import { ScaleOut, Circle2 } from 'svelte-loading-spinners';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import Banner from '$lib/components/banners/group-banner.svelte';
	import ScaleIcon from '$lib/assets/icons/ScaleIcon.svelte';

	export let data: PageData;

	// STATE MACHINE

	/**
	 * Events
	 * 		Internal
	 * 		CONNECTED_TO_SSE
	 * 		DISCONNECTED_FROM_SSE
	 * 		PRESSED_DINGDONG_BUTTON
	 * 		External
	 * 		BAT_SIGNAL_WAS_RAISED
	 * 		SOMEONE_RESPONDED
	 *
	 *
	 * State
	 * 		Initial
	 * 			{
	 * 				sseState: "CONNECTED | DISCONNECTED | CONNECTING",
	 * 				isDingDongTurnedOn: false,
	 * 				isSomeoneComing: false,
	 * 			}
	 */

	// interface DingDongState {
	// 	sse: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';
	// 	button: 'SLACK' | 'DINGDONG' | 'SCALEOUT' | 'CIRCLE2' | null;
	// 	dingDong: 'IDLE' | 'AWAITING_DINGDONG_RESPONSE' | 'DINGDONG_IS_ON' | 'SOMEONE_IS_COMING';
	// }

	// let state: DingDongState = {
	// 	sse: 'CONNECTING',
	// 	button: null,
	// 	dingDong: 'IDLE'
	// };

	interface SseMessage {
		is_bat_signal_busy: boolean;
		is_someone_coming: boolean;
	}

	onMount(async () => {
		if (!browser) return;

		console.clear();

		console.log('CONNECTING...');

		let reader: ReadableStreamDefaultReader;

		try {
			const response = await fetch(data.DINGDONG_ENDPOINT + '/connect', {
				method: 'POST',
				body: JSON.stringify({ isAuthorizedLOL: true })
			});
			reader = response.body!.getReader();
			const decoder = new TextDecoder();

			dispatch({ msg: 'CONNECTED_TO_SSE' });

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				const text = decoder.decode(value);
				const sseMessage: SseMessage = await JSON.parse(text.replace(/^data:/, ''));

				// console.log("SSE:", { is_bat_signal_busy, is_someone_coming })

				dispatch({ msg: 'RECEIVED_SSE_MESSAGE', data: { sseMessage } });
			}
		} catch (err) {
			console.error(err);
			// TODO: do this only on a disconnect error
			dispatch({ msg: 'DISCONNECTED_FROM_SSE' });
		}

		return () => {
			reader?.cancel();
		};
	});

	// PAGE STATE
	let sseState: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' = 'CONNECTING';

	let dingDongState:
		| 'READY'
		| 'DEVICE_IS_DISCONNECTED'
		| 'NO_SERVER'
		| 'AWAITING_DINGDONG_HTTP_RESP'
		| 'DINGDONG_IS_ON'
		| 'SOMEONE_IS_COMING' = 'READY';

	let bannerDescription = 'Checking status...'; // or "Connecting" ?

	let bodyText = '';

	interface DingDongEvent {
		msg:
			| 'CONNECTED_TO_SSE'
			| 'DISCONNECTED_FROM_SSE'
			| 'RECEIVED_SSE_MESSAGE'
			| 'MADE_DINGDONG_REQUEST'
			| 'DINGDONG_TURNED_ON'
			| 'SOMEONE_RESPONDED'
			| 'TIMED_OUT'; // tuned on and someone responded time out
		data?: {
			sseMessage: SseMessage;
		};
	}

	let dingDongTimeout: number;

	/** Should match the timeout in the Arduino sketch */
	const DINGDONG_TIMEOUT_MS = 30_000;

	function dispatch(event: DingDongEvent) {
		const { msg, data } = event;
		switch (msg) {
			case 'CONNECTED_TO_SSE':
				sseState = 'CONNECTED';
				break;

			case 'DISCONNECTED_FROM_SSE':
				sseState = 'DISCONNECTED';
				break;

			case 'RECEIVED_SSE_MESSAGE': {
				const {
					sseMessage: { is_bat_signal_busy, is_someone_coming }
				} = data!;

				if (is_someone_coming) {
					dingDongState === 'DINGDONG_IS_ON' && dispatch({ msg: 'SOMEONE_RESPONDED' });
					// loaded the page when someone was already on their way to open the door
					dingDongState === 'READY' && (dingDongState = 'SOMEONE_IS_COMING');
				} else if (is_bat_signal_busy) {
					// NOTE: dispatching 'DINGDONG_TURNED_ON' happens on successful dingDong() in onClick
					// loaded the page when the bat signal was already raised (ding dong already on)
					dingDongState === 'READY' && (dingDongState = 'DINGDONG_IS_ON');
				} else if (!is_bat_signal_busy && !is_someone_coming) {
					dingDongState = 'READY';
				}
				break;
			}

			case 'MADE_DINGDONG_REQUEST':
				dingDongState = 'AWAITING_DINGDONG_HTTP_RESP';
				break;

			case 'DINGDONG_TURNED_ON':
				clearTimeout(dingDongTimeout);
				dingDongTimeout = setTimeout(() => {
					dispatch({ msg: 'TIMED_OUT' });
				}, DINGDONG_TIMEOUT_MS);
				dingDongState = 'DINGDONG_IS_ON';
				break;

			case 'SOMEONE_RESPONDED':
				clearTimeout(dingDongTimeout);
				dingDongTimeout = setTimeout(() => {
					dispatch({ msg: 'TIMED_OUT' });
				}, DINGDONG_TIMEOUT_MS);
				dingDongState = 'SOMEONE_IS_COMING';
				break;

			case 'TIMED_OUT':
				dingDongState = 'READY';
				break;
		}

		// DEBUG
		console.log(
			`EVENT: ${msg} ::`,
			dingDongState,
			data?.sseMessage ? `\nSSE:` : '',
			data?.sseMessage ?? ''
		);
	}

	// REACTIVE BANNER DESCRIPTION
	$: bannerDescription = (() => {
		switch (sseState) {
			case 'CONNECTING':
				return 'Checking status...';
			case 'CONNECTED':
				return "Ding Dong's server is offline";
			case 'DISCONNECTED':
				return 'Are you locked out of Scale?';
		}
	})();

	async function onClickDingDongButton() {
		dispatch({ msg: 'MADE_DINGDONG_REQUEST' });
		const dingDongSucceeded = await dingDong();
		dingDongSucceeded && dispatch({ msg: 'DINGDONG_TURNED_ON' });
	}

	async function dingDong(): Promise<boolean> {
		try {
			const resp = await fetch(data.DINGDONG_ENDPOINT + '/dingDong', {
				method: 'POST',
				body: JSON.stringify({ isAuthorizedLOL: true })
			});
			const { success } = await resp.json();
			return success;
		} catch (err) {
			console.error('ERROR: There was a problem making the Ding Dong request:', err);
		}
		return false;
	}
</script>

<div class="flex flex-col gap-6 flex-1 relative">
	<div class="relative w-fit overflow-hidden w-full justify-center align-center flex">
		<Banner
			title="Ding Dong"
			description="{bannerDescription}"
			bannerClass="bg-scaleBanner text-white relative w-full"
		/>
		<ScaleIcon
			class="absolute md:opacity-30 md:scale-[.8] md:left-0 sm:scale-[1.2] opacity-[0.08] scale-[1.2] top-5"
		/>
	</div>
</div>

<div class="grid grid-rows-2 place-items-center h-full mt-4 w-50">
	<div class="flex flex-col items-center gap-4">
		<!-- TEXT -->
		{#each bodyText.split('\n') as line}
			<P>{line}</P>
		{/each}

		<!-- BUTTON -->
		<!-- {#if buttonState === "Slack"} -->
		{#if dingDongState === 'NO_SERVER' || dingDongState === 'DEVICE_IS_DISCONNECTED'}
			<a
				href="https://join.slack.com/t/nola/shared_invite/zt-31zf5522p-QgwI5Mca_he6jku5xfGVlA"
				target="_blank"
				rel="noopener noreferrer"
				class="bg-white dark:border-white hover:bg-gray-200 gap-2.5 border text-gray-900 font-medium py-1.5 md:py-2 px-3 rounded-lg text-sm md:text-base shadow-sm inline-flex items-center transition-colors"
			>
				<Icon name="slackIcon" className="w-4 h-4 md:w-5 md:h-5" />
				Community Slack
			</a>
		{:else}
			<Button
				id="dingDong"
				class="mt-4 w-40 h-14 active:dark:bg-primary-800 hover:dark:bg-primary-700
				{dingDongState === 'AWAITING_DINGDONG_HTTP_RESP'
					? ' dark:bg-primary-800 hover:dark:bg-primary-800 cursor-default'
					: ' hover:dark:bg-primary-700 dark:bg-primary-600'}"
				on:click="{onClickDingDongButton}"
			>
				<!-- {#if buttonState === "DINGDONG"} -->
				{#if dingDongState === 'READY'}
					Ding Dong
					<!-- {:else if buttonState === 'SCALEOUT'} -->
				{:else if dingDongState === 'AWAITING_DINGDONG_HTTP_RESP'}
					<!-- TODO: do we need this dingDongState and buttonState?  -->
					<ScaleOut size="50" color="#a855f7" unit="px" duration="1.2s" />
					<!-- {:else if buttonState === "Circle2"} -->
				{:else if dingDongState === 'DINGDONG_IS_ON' || dingDongState === 'SOMEONE_IS_COMING'}
					<Circle2
						size="50"
						colorOuter="#a855f7"
						colorInner="#c084fc"
						colorCenter="#d8b4fe"
						unit="px"
						durationOuter="1.2s"
					/>
				{/if}
			</Button>
		{/if}

		<!-- LOADER -->
	</div>
</div>
