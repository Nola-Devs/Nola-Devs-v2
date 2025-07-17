<script lang="ts">
	import { browser } from '$app/environment';
	import { P, Button } from 'flowbite-svelte';
	import { ScaleOut, Circle2 } from 'svelte-loading-spinners';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import Banner from '$lib/components/banners/group-banner.svelte';
	import ScaleIcon from '$lib/assets/icons/ScaleIcon.svelte';

	export let data: PageData;

	interface SseMessage {
		heartbeat?: number;
		is_bat_signal_busy?: boolean;
		is_someone_coming?: boolean;
	}

	onMount(async () => {
		if (!browser) return;

		// DEBUG
		console.clear();

		console.log('CONNECTING TO SSE...');

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
				!sseMessage.heartbeat && dispatch({ msg: 'RECEIVED_SSE_MESSAGE', data: { sseMessage } });
			}
		} catch (err) {
			console.error(err);
			// TODO: do this only on a disconnect error
			(err as Error).message === 'Failed to fetch' && dispatch({ msg: 'DISCONNECTED_FROM_SSE' });
		}

		// TODO: reconnect on error/disconnect

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

	$: bannerDescription = (() => {
		switch (sseState) {
			case 'CONNECTING':
				return 'Connecting...';
			case 'CONNECTED':
				return 'Are you locked out of Scale?';
			case 'DISCONNECTED':
				return "Ding Dong's server is offline";
		}
	})();

	$: bodyText = (() => {
		switch (dingDongState) {
			case 'NO_SERVER':
				return "Whoops! Ding Dong isn't working right now.\nContact someone in slack to let them know you're outside.";
			case 'READY':
				return "Click here to let someone know you're outside";
			case 'DINGDONG_IS_ON':
				return 'The Bat Signal has been raised!\nWaiting for someone to respond...';
			case 'SOMEONE_IS_COMING':
				return 'Someone is on their way to let you in!\nGive it a minute or two.';
		}
		return '';
	})();

	interface DingDongEvent {
		msg:
			| 'CONNECTED_TO_SSE'
			| 'DISCONNECTED_FROM_SSE'
			| 'RECEIVED_SSE_MESSAGE'
			| 'MADE_DINGDONG_REQUEST'
			| 'DINGDONG_REQUEST_FAILED'
			| 'DINGDONG_TURNED_ON'
			| 'SOMEONE_RESPONDED'
			| 'TIMED_OUT'; // tuned on and someone responded time out
		data?: {
			sseMessage: SseMessage;
		};
	}

	/** Should match the timeout in the Arduino sketch */
	const DINGDONG_TIMEOUT_MS = 30_000;
	let dingDongTimeout: number;

	function dispatch(event: DingDongEvent) {
		const { msg, data } = event;
		switch (msg) {
			case 'CONNECTED_TO_SSE':
				sseState = 'CONNECTED';
				dingDongState = 'READY';
				break;

			case 'DISCONNECTED_FROM_SSE':
				sseState = 'DISCONNECTED';
				dingDongState = 'NO_SERVER';
				break;

			case 'RECEIVED_SSE_MESSAGE': {
				const {
					sseMessage: { is_bat_signal_busy, is_someone_coming }
				} = data!;
				if (is_someone_coming) {
					dispatch({ msg: 'SOMEONE_RESPONDED' });
					break;
				}
				if (is_bat_signal_busy) {
					dispatch({ msg: 'DINGDONG_TURNED_ON' });
					break;
				}
				dingDongState = 'READY';
				break;
			}

			case 'MADE_DINGDONG_REQUEST':
				dingDongState = 'AWAITING_DINGDONG_HTTP_RESP';
				break;

			case 'DINGDONG_REQUEST_FAILED':
				dingDongState = 'NO_SERVER';
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

		<div class="text-center max-w-[50ch]">
			{#each bodyText.split('\n') as line}
				<P class="text-center">{line}</P>
			{/each}
		</div>

		<!-- BUTTON -->
		{#if dingDongState === 'NO_SERVER' || dingDongState === 'DEVICE_IS_DISCONNECTED'}
			<a
				href="https://join.slack.com/t/nola/shared_invite/zt-2wwyu8rif-TCXX17XO~xSet3MCheK8uw"
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
				class="
					mt-4 w-40 h-14 active:dark:bg-primary-800 hover:dark:bg-primary-700
					{dingDongState === 'AWAITING_DINGDONG_HTTP_RESP'
					? ' dark:bg-primary-800 hover:dark:bg-primary-800 cursor-default'
					: ' hover:dark:bg-primary-700 dark:bg-primary-600'}
					{dingDongState !== 'READY' ? ' opacity-100 cursor-wait' : ''} 
				"
				disabled="{dingDongState !== 'READY'}"
				on:click="{onClickDingDongButton}"
			>
				{#if dingDongState === 'READY'}
					Ding Dong
				{:else if dingDongState === 'AWAITING_DINGDONG_HTTP_RESP' || dingDongState === 'DINGDONG_IS_ON'}
					<!-- TODO: do we need this dingDongState and buttonState?  -->
					<ScaleOut size="50" unit="px" color="#a855f7" duration="1.2s" />
				{:else if dingDongState === 'SOMEONE_IS_COMING'}
					<Circle2
						size="50"
						unit="px"
						colorOuter="#a855f7"
						colorInner="#c084fc"
						colorCenter="#d8b4fe"
						durationOuter="1.2s"
					/>
				{/if}
			</Button>
		{/if}
	</div>
</div>
