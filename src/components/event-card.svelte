<script lang="ts">
	import type { Event } from '../app';
	import { onMount, onDestroy } from 'svelte';
	import { Map, Marker, type LngLatLike } from 'mapbox-gl';
	import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	export let event: Event;
	$: event;
	let start = new Date(event.start);
	let end = new Date(event.end);

	let month = (m: any) => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(m);
	let time = (t: any) => new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(t);
	let coordinates: LngLatLike = [-71.224518, 20];
	let mapContainer: HTMLDivElement;
	let map: Map;

	$: startMonth = month(start);
	$: startTime = time(start);
	$: endMonth = month(end);
	$: endTime = time(end);

	$: map;
	$: coordinates;
	$: zoom = 16;

	const updateData = () => {
		zoom = map.getZoom();
		coordinates[0] = map.getCenter().lat;
		coordinates[1] = map.getCenter().lat;
	};

	let mapRender = async () => {
		const key =
			'pk.eyJ1IjoiY29kaW5nbXVzdGFjaGUiLCJhIjoiY2xmbmduaXB4MDZ6YzN0cGpwc2dybnJrciJ9.wISnVUWHgy94Wc1VMxwqgg';
		const businessAndAddressRegex =
			/\b\d+\s+[a-zA-Z0-9\s.,-]+,\s*[a-zA-Z\s]+\s*,\s*[a-zA-Z]+\s*\d{5}(?:-\d{4})?\s*,\s*[a-zA-Z]+\b/;
		const locationURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.location.match(
			businessAndAddressRegex
		)}.json?types=address&access_token=${key}`;

		console.log(event.location.match(businessAndAddressRegex));

		let req = await (await fetch(locationURL, { method: 'GET' })).json();

		coordinates = req.features[0].center as LngLatLike;

		map = await new Map({
			container: mapContainer,
			accessToken: key,
			style: `mapbox://styles/mapbox/standard-beta`,
			center: coordinates,
			zoom: zoom
		});

		await new Marker().setLngLat(coordinates).addTo(map);
		map.on('move', () => {
			updateData();
		});
	};

	onMount(() => mapRender());
</script>

<h2>{event.summary}</h2>
<p>
	{endMonth === startMonth
		? `${startMonth} ${start.getDate()}`
		: `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`}
	{start.getFullYear()}
</p>

<p>
	{startTime} - {endTime}
</p>
<p>{@html event.description}</p>
<p>{event.location}</p>

<div class="map-frame">
	<div class="map-wrap">
		<div class="map" bind:this="{mapContainer}"></div>
	</div>
	<div class="directions">
		<p>Directions</p>
	</div>
</div>

<style>
	h2 {
		font-size: larger;
	}
	.map {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		z-index: 2;
	}
	.map-wrap {
		transition: 0.5s;
		aspect-ratio: 1/1;
		height: 200px;
		border-radius: 10px;
	}

	.map-frame {
		margin: 10px;
		width: fit-content;
		aspect-ratio: 1/1;
		transition: 0.2s;
		display: inline-block;
		margin: 50px;
	}

	.map-frame:hover {
		scale: 1.02;
	}
	.map-frame:hover .directions {
		animation: example 0.2s normal forwards ease-in-out;
	}

	.directions {
		margin-top: -50%;
		height: 30px;
		width: 100%;
		transition: 0.2s;
		box-shadow:
			inset -3px -3px 10px black,
			inset 3px 3px 10px white;
		background-color: rgb(169, 169, 169);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}
	.directions:hover {
		box-shadow: inset 0 0 10px black;
	}

	@keyframes example {
		from {
			margin-top: -50%;
		}
		to {
			margin-top: 5%;
		}
	}
</style>
