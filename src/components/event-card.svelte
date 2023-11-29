<script lang="ts">
	import type { Event } from '../app';
	import { onMount, onDestroy } from 'svelte';
	import { Map, Marker, type LngLatLike } from 'mapbox-gl';
	import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	export let event: Event;

	let start = new Date(event.start);
	let end = new Date(event.end);
	let month = (m: any) => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(m);
	let time = (t: any) => new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(t);
	let coordinates: LngLatLike = [-71.224518, 20];
	let mapContainer: HTMLDivElement;
	let map: Map;

	$: event;
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

<div class="event-card">
	<h2>{event.summary}</h2>

	<div class="event-info">
		<div class="event-text">

			<p>
				{endMonth === startMonth
				? `${startMonth} ${start.getDate()}`
				: `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`},
			{start.getFullYear()}
		</p>
		
		<p>
			{startTime} - {endTime}
		</p>
		<p>{@html event.description}</p>
		<p>{event.location}</p>
	</div>
		
		<!-- Map Container-->
		<div class="map-frame">
			<div class="map-wrap">
				<div class="map" bind:this="{mapContainer}"></div>
			</div>
			<a href="https://maps.google.com/?q={event.location}">
				<a href="https://maps.apple.com/maps?q={event.location}">
					<div class="directions">
						<p>Directions</p>
					</div>
				</a>
			</a>
		</div>

	</div>
</div>

<style>
	h2 {
		font-size: x-large;
		text-align: center;
	}
	.event-info{
		display: flex;
		align-items: center;
		height: 100%;
	}
	.event-card {
		width: 50%;
		height: 300px;
		margin: 10px auto;
		padding:20px;
		background-color: rgb(179, 179, 179);
	}
	.event-text{
		display: flex;
		flex-direction: column;
		gap:10px;
		padding:10px;
		height: 100%;
	}
	.map {
		margin-top: -10%;
		width: 100%;
		height: 100%;
		border-radius: 10px;
		z-index: 2;
		transition: 0.5s;

	}
	.map:hover {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.568);
	}
	.map-wrap {
		transition: 0.5s;
		height: 200px;
		width: 200px;
		border-radius: 10px;
	}

	.map-frame {
		width: fit-content;
		height: fit-content;
		transition: 0.2s;
		display: inline;
		position: relative;
	}

	.map-frame:hover {
		scale: 1.02;
	}
	.map-frame:hover .directions {
		animation: slideDown 0.5s alternate both ease;
	}

	.directions {
		animation: slideUp 0.5s alternate both ease;
		margin-top: -50%;
		height: 30px;
		width: 90%;
		margin-left: auto;
		margin-right: auto;
		transition: 0.2s;
		box-shadow:
			inset -5px -5px 10px rgba(0, 0, 0, 0.621),
			inset 5px 5px 10px white;
		background-color: rgb(224, 224, 224);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100px;
	}

	.directions:hover {
		box-shadow: inset 0 0 10px black;
		scale: 0.95;
	}

	@keyframes slideDown {
		from {
			margin-top: -50%;
			scale: 0.2;
		}
		to {
			margin-top: 5%;
		}
	}
	@keyframes slideUp {
		from {
			margin-top: 5%;
		}
		to {
			scale: 0.2;
			margin-top: -50%;
		}
	}
</style>
