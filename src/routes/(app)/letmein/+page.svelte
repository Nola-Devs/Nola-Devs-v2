<script lang="ts">
	const TEMP_DINGDONG_ENDPOINT = 'http://127.0.0.1:8080';

	async function dingDong() {
		try {
			const resp = await fetch(TEMP_DINGDONG_ENDPOINT + '/dingDong', {
				method: 'POST',
				body: JSON.stringify({ isAuthorizedLOL: true })
			});
			const { success } = await resp.json();
			if (!success) return false;
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	const Global = {
		dingDong
	};
</script>

<div class="flex flex-col place-items-center justify-center md:flex-row md:gap-8 flex-1">
	<!-- <span id="sse-status" class="margin float-right">🟡</span> -->
	<!-- <main>
		<div class="container flex-centered">
			<div class="flex-centered text-center"> -->
	<!-- <span id="is-someone-coming">&nbsp;</span>
				<span id="is-bat-signal-busy" class="margin">Bat Signal ready.</span> -->
	<button
		id="dingDong"
		class="w-32 bg-white dark:border-white hover:bg-gray-200 gap-2.5 border text-gray-900 font-medium text-2xl py-3 md:py-2 rounded-lg md:text-base shadow-sm items-center transition-colors"
		on:click="{dingDong}">dingDong</button
	>
	<!-- </div>
		</div>
	</main> -->
</div>

<!-- 
LEADER BOARD

3 cols

avatar | user | score


-->

<style>
	/* .body {
    display: flex;
    justify-content: center;
    align-items: center;
		height: 100dvh;
		width: 100dvw;
		position: relative;
	} */

	.container {
		position: absolute;
		inset: 0;
	}

	.flex-centered {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.text-center {
		text-align: center;
	}

	.margin {
		margin: 2rem;
	}

	.float-right {
		float: right;
	}
</style>
