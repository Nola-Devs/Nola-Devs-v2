<script lang="ts">
	
	import IconParser from './icon-parser.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { Group } from '$types'

	export let groupData : Group;
	let groupName: string
	$: groupName = groupData?.group 
	$: groupData

	const copy = () => {
		navigator.clipboard.writeText(groupData.calID);
		try {
			toast('Calendar ID Copied to Clipboard!', { icon: '📋' });
		} catch {
			toast('Calendar ID not copied, Unsuporrted browser', { icon: '❌' });
		}
	};

</script>

<div class="card">
	<div class="group-info">
		
			
		<h1>
			{groupData?.group}
		</h1>
		
		<p>
			{groupData?.about}
		</p>

		<div class="card-links">
			<button on:click="{copy}">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
				</svg>
				<p>Suscribe to this Calendar</p>
			</button>

			<div class="links">
				{#if groupData}
				{#each Object.entries(groupData?.orgLinks) as [site, links] (site)}
					<a href="{links}" target="_blank">
						<IconParser icon="{site}" size="{30}" />
					</a>
				{/each}
				{/if}
			</div>
		</div>
	</div>

	<div class="organizer-list">
		{#if groupData?.organizers } 
		{#each groupData.organizers as organizer}
			<div class="organizer-info">
				<p>
					{organizer.name}
				</p>
				<img src="images/organizers/{organizer.pfp}" alt="" width="200px" height="200px" />
				<div class="organizer-links">
					{#each Object.entries(organizer.links) as [site, links] (site)}
						<a href="{links}" target="_blank">
							<IconParser icon="{site}" color="{'white'}" />
						</a>
					{/each}
				</div>
			</div>
		{/each}
		{/if}
	</div>
	<Toaster />
</div>

<style>
	h1 {
		font-family: var(--title);
		text-align: center;
		font-weight: 100;
	}
	.links {
		display: flex;
		gap: 10px;
	}
	.card {
		display: flex;
		clip-path: fill-box;
		background-color: var(--card-bg);
		font-family: var(--read);
		height: 100%;
		widows: 100%;
	}
	.group-info {
		padding: 10px;
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.group-info p {
		height: 100%;
		overflow-y: auto;
		font-family: var(--read);
	}
	svg {
		min-height: 25px;
		min-width: 25px;
	}
	.organizer-info {
		display: inline;
	}

	.card-links {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 5px;
		gap: 5px;
		flex-wrap: wrap;
	}

	.organizer-info {
		width: 100%;
		position: relative;
	}
	.organizer-links,
	.organizer-info p {
		background-color: rgba(97, 97, 97, 0.413);
		position: absolute;
		color: white;
		width: 100%;
		z-index: 2;
		font-size: large;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		padding: 3px;
	}
	.organizer-links {
		bottom: 0px;
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		padding: 5px;
	}

	.organizer-info img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale();
		transition: 1s;
	}
	.organizer-info img:hover {
		filter: grayscale(0);
	}

	button {
		display: flex;
		align-items: center;
		gap: 3px;
		font-family: var(--small-title);
		font-size: large;
		border-radius: 5px;
		border: unset;
		background-color: var(--button-color);
		float: right;
	}
	button svg {
		width: 20px;
		height: 20px;
		margin: 5px;
	}

	.organizer-list {
		display: flex;
		width: 50%;
	}
</style>
