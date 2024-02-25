<script lang="ts">
	import { Map, Marker, type LngLatLike } from 'mapbox-gl';
	import './mapbox-gl.css';
	import { onMount, onDestroy } from 'svelte';
	export let location: LngLatLike;
	let map: any;
	let mapContainer: any;
	let zoom: any;

	zoom = 17;

	const mapRender = async () => {
		const key =
			'pk.eyJ1IjoiY29kaW5nbXVzdGFjaGUiLCJhIjoiY2x0MHdla2xrMTJsZTJqbWN6ajVjaWpubSJ9.LkJ1K0P4rDOh4zXbYJrB8w';

		map = new Map({
			container: mapContainer,
			accessToken: key,
			style: `mapbox://styles/mapbox/standard-beta`,
			center: location,
			zoom: zoom,
			pitch: 30
		});

		new Marker().setLngLat(location).addTo(map);
	};
	onMount(mapRender);

	// onDestroy(() => {
	// 	map.remove();
	// });
</script>

<div class="w-full h-full rounded-t-lg" bind:this="{mapContainer}"></div>
