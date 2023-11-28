<script lang="ts">
	import type { Event } from '../app';
	import { onMount, onDestroy } from 'svelte';
	import { Map, Marker, type LngLatLike } from 'mapbox-gl';
	import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	export let event: Event;
  $: event
	let start = new Date(event.start);
	let end = new Date(event.end);

	let month = (m: any) => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(m);
	let time = (t: any) => new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(t);
	let coordinates: LngLatLike = [-71.224518, 20];
	let mapContainer: HTMLDivElement;
  let map: Map

	$: startMonth = month(start);
	$: startTime = time(start);
	$: endMonth = month(end);
	$: endTime = time(end);

	$: map
	$: coordinates;
	$: zoom = 16;

  const updateData = () => {
    	zoom = map.getZoom();
    	coordinates[0] = map.getCenter().lat;
    	coordinates[1] = map.getCenter().lat;
  }

	let mapRender = async () => {
    const key = 'pk.eyJ1IjoiY29kaW5nbXVzdGFjaGUiLCJhIjoiY2xmbmduaXB4MDZ6YzN0cGpwc2dybnJrciJ9.wISnVUWHgy94Wc1VMxwqgg'
		const businessAndAddressRegex =
			/(.+?)\s(\d+\s[A-Za-z\s]+,\s[A-Za-z\s]+,\s[A-Za-z]+\s\d{5},\s[A-Za-z\s]+)/;
		const locationURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
			event.location.match(businessAndAddressRegex)[2]
		}.json?types=address&access_token=${key}`;

		let req = await (await fetch(locationURL, { method: 'GET' })).json();

		coordinates = req.features[0].center as LngLatLike;

		map = await new Map({
			container: mapContainer,
			accessToken: key,
			style: `mapbox://styles/mapbox/standard-beta`,
			center: coordinates,
			zoom: zoom,
			interactive: false,
			pitch: 3
		});
		await new Marker().setLngLat(coordinates).addTo(map);
    map.on('move', () => {
        updateData();
      })
	};

	onMount(()=>mapRender())

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

<div class="map-wrap">
	<div class="map" bind:this="{mapContainer}"></div>
  <div class="directions">
    <button>
      <p>
        Directions
      </p>
    </button>
  </div>
</div>

<style>
	h2 {
		font-size: large;
	}
	.map {
		width: 100%;
		height: 100%;
	}
	.map-wrap {
    border-radius: 3px;
    transition: 0.5s;
		margin: 10px;
		aspect-ratio: 1/1;
		height: 200px;
    clip-path: fill-box;
	}

  .map-wrap:hover{
    filter: blur(3px)
  }

  .directions{
    z-index: 10;
  }
</style>
