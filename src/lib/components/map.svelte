<script lang="ts">
	import './mapbox-gl.css';
	import { Map, Marker, type LngLatLike, type Map as MapType } from 'mapbox-gl';
	import { onMount, onDestroy } from 'svelte';
	import { PUBLIC_MAPBOX } from '$env/static/public';
	export let location: LngLatLike;

	let map: MapType;
	let mapContainer: HTMLElement | string;
	let zoom: number;

	zoom = 17;

	const mapRender = async () => {
		const key = PUBLIC_MAPBOX;

		map = new Map({
			container: mapContainer,
			accessToken: key,
			style: `mapbox://styles/mapbox/standard`,
			center: location,
			zoom: zoom,
			pitch: 30
		});

		new Marker().setLngLat(location).addTo(map);
	};
	onMount(mapRender);

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div class="w-full h-36 rounded-b-lg" bind:this="{mapContainer}"></div>
