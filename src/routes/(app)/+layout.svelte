<script lang="ts">
	import { dev } from '$app/environment';

	// import { inject } from '@vercel/analytics';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let y: number;
	$: isHidden = y > 800;

	// inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:window bind:innerWidth="{y}" />
<div id="main">
	<nav>
		<a class="logo" href="/">
			<img src="" alt="logo" />
			<h1>NOLA Devs</h1>
		</a>

		<details open="{isHidden}">
			<summary>
				<img
					src="https://www.gmprt.com/wp-content/uploads/icon.png"
					alt="ling"
					height="30px"
					width="30px"
				/>
				<h2>Groups</h2>
			</summary>
			{#each data.groups as group}
				<a href="/group/{group?.replace(/[ ]/g, '-')}">
					<p>
						{group}
					</p>
				</a>
			{/each}
		</details>

		<details class="end" open="{isHidden}">
			<summary>
				<img
					src="https://www.gmprt.com/wp-content/uploads/icon.png"
					alt="ling"
					height="30px"
					width="30px"
				/>
				<h2>Other Links</h2>
			</summary>

			<a href="/contact">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M3 3V2H2v1h1zm9.293 10.707a1 1 0 001.414-1.414l-1.414 1.414zM4 11V3H2v8h2zM3 4h8V2H3v2zm-.707-.293l10 10 1.414-1.414-10-10-1.414 1.414z"
						fill="#33363F"
					></path><path
						d="M4 15v0c0 1.87 0 2.804.402 3.5A3 3 0 005.5 19.598C6.196 20 7.13 20 9 20h5c2.828 0 4.243 0 5.121-.879C20 18.243 20 16.828 20 14V9c0-1.87 0-2.804-.402-3.5A3 3 0 0018.5 4.402C17.804 4 16.87 4 15 4v0"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					></path></svg
				>
				<p>Contact</p>
			</a>
			<a href="/submit-event">
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M17.5 12a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm.25-9A3.25 3.25 0 0121 6.25l.001 5.773a6.47 6.47 0 00-1.5-.71L19.5 8.5h-15v9.25c0 .966.784 1.75 1.75 1.75h5.064a6.47 6.47 0 00.709 1.501L6.25 21A3.25 3.25 0 013 17.75V6.25A3.25 3.25 0 016.25 3h11.5zm-.25 11l-.09.008a.5.5 0 00-.402.402L17 14.5V17h-2.5l-.09.008a.5.5 0 00-.402.402L14 17.5l.008.09a.5.5 0 00.402.402l.09.008H17v2.5l.008.09a.5.5 0 00.402.402l.09.008.09-.008a.5.5 0 00.402-.402L18 20.5V18h2.5l.09-.008a.5.5 0 00.402-.402L21 17.5l-.008-.09a.5.5 0 00-.402-.402L20.5 17H18v-2.5l-.008-.09a.5.5 0 00-.402-.402L17.5 14zm.25-9.5H6.25A1.75 1.75 0 004.5 6.25V7h15v-.75a1.75 1.75 0 00-1.75-1.75z"
						fill="currentColor"
						fill-rule="nonzero"
					></path></svg
				>
				<p>Submit Event</p>
			</a>
			<a href="/mission-statement">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M11.302 21.615c.221.129.332.194.488.227.122.026.298.026.42 0 .156-.033.267-.098.488-.227C14.646 20.478 20 16.908 20 12V6.6c0-.558 0-.837-.107-1.05a.993.993 0 00-.432-.436c-.211-.11-.495-.113-1.062-.12C15.427 4.96 13.714 4.714 12 3c-1.714 1.714-3.427 1.959-6.399 1.994-.567.007-.851.01-1.062.12a.993.993 0 00-.432.436C4 5.763 4 6.042 4 6.6V12c0 4.908 5.354 8.478 7.302 9.615z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				<p>Mission Statement</p>
			</a>
			<a href="/sponsors">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M11.302 21.615c.221.129.332.194.488.227.122.026.298.026.42 0 .156-.033.267-.098.488-.227C14.646 20.478 20 16.908 20 12V6.6c0-.558 0-.837-.107-1.05a.993.993 0 00-.432-.436c-.211-.11-.495-.113-1.062-.12C15.427 4.96 13.714 4.714 12 3c-1.714 1.714-3.427 1.959-6.399 1.994-.567.007-.851.01-1.062.12a.993.993 0 00-.432.436C4 5.763 4 6.042 4 6.6V12c0 4.908 5.354 8.478 7.302 9.615z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				<p>Sponsors</p>
			</a>
			<a href="/team">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M11.302 21.615c.221.129.332.194.488.227.122.026.298.026.42 0 .156-.033.267-.098.488-.227C14.646 20.478 20 16.908 20 12V6.6c0-.558 0-.837-.107-1.05a.993.993 0 00-.432-.436c-.211-.11-.495-.113-1.062-.12C15.427 4.96 13.714 4.714 12 3c-1.714 1.714-3.427 1.959-6.399 1.994-.567.007-.851.01-1.062.12a.993.993 0 00-.432.436C4 5.763 4 6.042 4 6.6V12c0 4.908 5.354 8.478 7.302 9.615z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				<p>Meet the Team</p>
			</a>
			<a href="https://join.slack.com/t/nola/shared_invite/zt-256vzyuvo-1KC88G~MLCT8KCgw4QL7zg">
				<svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
					></path></svg
				>
				<p>Join The Slack</p>
			</a>
		</details>
	</nav>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	:global(:root) {
		--shadow-move-up: 0 0 10px rgba(0, 0, 0, 0.568);
		--shadow-move-back: inset -5px -5px 10px rgba(0, 0, 0, 0.621), inset 5px 5px 10px white;
		--card-bg: #e9e9e9;
		--title: 'watchword', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--small-title: 'panton', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--read: 'kabrio', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--card-radius: 10px;
		--button-color: rgb(184, 184, 184);
	}
	#main {
		display: grid;
		grid-template-columns: [first] 200px [line2] auto;
		font-family: var(--read);
		height: 100vh;
	}

	nav {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 5px 0px 5px 5px;
		border-bottom: solid 1px black;
	}

	svg {
		width: 20px;
		height: 20px;
	}
	details {
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 3px;
		border-radius: 5px;
		background-color: var(--card-bg);
	}
	summary {
		display: flex;
		align-items: center;
		pointer-events: none;
		user-select: none;
	}

	a {
		text-decoration: unset;
		color: unset;
		display: flex;
		gap: 3px;
	}

	.logo h1 {
		font-family: 'adam';
		font-weight: 100;
		color: black;
		text-decoration: unset;
		font-size: larger;
	}

	.logo {
		display: flex;
		height: fit-content;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	@media only screen and (max-width: 800px) {
		#main {
			grid-template-columns: unset;
			grid-template-rows:
				[navbar] 10%,
				[info] auto;
		}
		details h2 {
			font-size: smaller;
		}
		.content {
			margin-top: 75px;
		}
		summary {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			height: fit-content;
			width: 100px;
			height: 100%;
			pointer-events: all;
			user-select: all;
		}
		details a {
			background-color: var(--card-bg);
			padding: 10px;
		}
		details {
			border-radius: 10px;
			z-index: 10;
			position: fixed;
			left: 50%;
			height: 7%;
		}
		details[open] a {
			border: solid 1px black;
			border-top: none;
			border-radius: 0 0 5px 5px;
			margin-top: -3px;
		}
		details[open] {
			margin-top: 10px;
		}
		.end {
			position: fixed;
			left: 0px;
		}
		nav {
			box-shadow: 0 0 10px black;
			display: flex;
			flex-direction: row-reverse;
			z-index: 2;
			height: 8%;
			width: 100%;
			padding: 5px;
			position: fixed;
			justify-content: space-between;
			background-color: #e9e9e9;
		}

		.logo {
			flex-direction: column;
			font-size: smaller;
			margin: 0 auto;
		}
		img {
			height: 30px;
			width: 30px;
		}
		.logo {
			height: 100%;
			width: fit-content;
			margin: unset;
		}
	}
</style>
