<script lang="ts">
	import type { Event } from '$types';
	import { onMount, onDestroy } from 'svelte';
	// import { RevGeocode } from '$lib/utils/rev-geocode';
	//import { Map, Marker, type LngLat, LngLatBounds, type LngLatBoundsLike } from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	export let event: Event;

	let { start, end, description, summary, calLink, location } = event;

	// let coordinates: LngLat;
	// let mapContainer: HTMLDivElement;
	// let map: Map;

	// $: start, end, description, summary, calLink, location;
	// $: map;
	// $: coordinates;
	// $: zoom = 10;

	// const mapRender = async () => {
	// 	const key =
	// 		'pk.eyJ1IjoiY29kaW5nbXVzdGFjaGUiLCJhIjoiY2xwbG1lZGUxMDFkNDJxbzlwbmlvODA3eCJ9.cueMasr8_HGiV_fBzJJx1w';
	// 	coordinates = (await RevGeocode(location)) as LngLat;

	// 	map = await new Map({
	// 		container: mapContainer,
	// 		accessToken: key,
	// 		style: `mapbox://styles/mapbox/standard`,
	// 		center: coordinates,
	// 		zoom: zoom,
	// 	});

	// 	await new Marker({
	// 		color: 'blue'
	// 	})
	// 		.setLngLat(coordinates)
	// 		.addTo(map);
	// }

	// onMount(() => mapRender());
</script>

<div class="event-card">
	<div class="event-info">
		<h2>{summary}</h2>
		<div class="when-where">
			<div class="date-time">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M3 10h18M7 3v2m10-2v2M6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 19.48 21 18.92 21 17.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 6.52 3 7.08 3 8.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 21 5.08 21 6.2 21z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				<p id="date">
					{#if start.date === end.date}
						{start.date}
					{:else}
						{start.date} - {end.date}
					{/if}
				</p>
			</div>

			{#if start.time}
				<div class="date-time">
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19 1.444.194 2.584.6 3.479 1.494.895.895 1.3 2.035 1.494 3.48.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53-.194 1.444-.6 2.584-1.494 3.479-.895.895-2.035 1.3-3.48 1.494-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19-1.444-.194-2.584-.6-3.479-1.494-.895-.895-1.3-2.035-1.494-3.48-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53.194-1.444.6-2.584 1.494-3.479.895-.895 2.035-1.3 3.48-1.494 1.411-.19 3.22-.19 5.529-.19zm-5.33 1.676c-1.278.172-2.049.5-2.618 1.069-.57.57-.897 1.34-1.069 2.619-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62.57.569 1.34.896 2.619 1.068 1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069.569-.57.896-1.34 1.068-2.619.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62-.57-.569-1.34-.896-2.619-1.068-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176zM12 7.25a.75.75 0 01.75.75v3.69l2.28 2.28a.75.75 0 11-1.06 1.06l-2.134-2.134c-.29-.289-.434-.433-.51-.617-.076-.184-.076-.388-.076-.797V8a.75.75 0 01.75-.75z"
							fill="currentColor"
						></path></svg
					>
					<p id="time">
						<time datetime="{start.time}">
							{start.time}
						</time>
						-
						<time datetime="{end.time}">
							{end.time}
						</time>
					</p>
				</div>
			{/if}
			{#if location}
				<a href="https://www.google.com/maps/search/?api=1&query={location}" target="_blank">
					<div class="addy">
						<svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
							><path
								d="M23.25 8v-.018a7.25 7.25 0 10-8.544 7.135l.044.007V30a1.25 1.25 0 002.5 0V15.124c3.425-.615 5.992-3.568 6-7.123V8zM16 12.75A4.75 4.75 0 1120.75 8 4.756 4.756 0 0116 12.75z"
							></path></svg
						>
						<p>
							{location.split(/[,0-9]/)[0].trim()}
						</p>
					</div>
				</a>
			{/if}
		</div>
		{#if description}
			<p id="description">{@html description.slice(0, 200)}</p>
		{/if}
		<div class="links">
			{#if calLink}
				<a href="{calLink}">
					<button>
						<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path
								d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"
							></path></svg
						>
						<p>GoogleCal</p>
					</button>
				</a>
			{/if}
			{#if location}
				<a href="https://maps.google.com/?q={location}">
					<a href="https://maps.apple.com/maps?q={location}">
						<button>
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M2 14.803v6.447c0 .414.336.75.75.75h1.614a.75.75 0 00.74-.627L5.5 19h13l.395 2.373a.75.75 0 00.74.627h1.615a.75.75 0 00.75-.75v-6.447a5.954 5.954 0 00-1-3.303l-.78-1.17a1.994 1.994 0 01-.178-.33h.994a.75.75 0 00.671-.415l.25-.5A.75.75 0 0021.287 8H19.6l-.31-1.546a2.5 2.5 0 00-1.885-1.944C15.943 4.17 14.141 4 12 4c-2.142 0-3.943.17-5.405.51a2.5 2.5 0 00-1.886 1.944L4.399 8H2.714a.75.75 0 00-.67 1.085l.25.5a.75.75 0 00.67.415h.995a1.999 1.999 0 01-.178.33L3 11.5c-.652.978-1 2.127-1 3.303zm15.961-4.799a4 4 0 00.34.997H5.699c.157-.315.271-.65.34-.997l.632-3.157a.5.5 0 01.377-.39C8.346 6.157 10 6 12 6s3.654.156 4.952.458a.5.5 0 01.378.389l.631 3.157zM5.5 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
									fill="currentColor"
								></path>
							</svg>
							<p>Directions</p>
						</button>
					</a>
				</a>
			{/if}
		</div>
	</div>

	<!-- <div class="map-wrap">
		<div class="map" bind:this="{mapContainer}"></div>
	</div> -->
</div>

<style>
	.addy {
		display: flex;
		align-items: center;
	}
	.when-where {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 5px;
		font-size: small;
		font-weight: 1;
		color: rgb(134, 134, 134);
	}
	.date-time {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
	}
	svg {
		height: 15px;
		width: 15px;
	}
	h2 {
		font-size: large;
		text-align: center;
		font-family: var(--title);
		font-weight: 100;
		font-size: medium;
	}
	p {
		font-family: var(--read);
		font-size: small;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		font-family: var(--small-title);
		border-radius: 5px;
		border: unset;
		background-color: var(--button-color);
		padding: 0 10px;
		float: right;
	}
	a {
		text-decoration: none;
		color: unset;
	}

	.event-card {
		display: grid;
		grid-template-columns: [info]75% [map]25%;
		background-color: rgb(230, 230, 230);
		scroll-snap-align: start;
		border-radius: 5px;
		clip-path: fill-box;
		width: 100%;
		height: fit-content;
		max-height: 300px;
	}

	.event-info {
		font-family: var(--read);
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 10px;
		gap: 3px;
	}

	#description {
		max-height: 200px;
		overflow-y: auto;
	}

	.links {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.map-wrap {
		height: 100%;
		width: 100%;
	}
	.map {
		background-color: aliceblue;
		width: 100%;
		height: 100%;
	}
</style>
