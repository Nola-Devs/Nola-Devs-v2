<script>
	import { slide } from 'svelte/transition';
	import { bounceOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import { Carousel } from 'flowbite-svelte';

	export const images = [
		{
			alt: 'Cosmic timetraveler',
			src: 'https://thetechtribune.com/wp-content/uploads/2020/09/24-800x445.jpg',
			title: 'cosmic-timetraveler-pYyOZ8q7AII-unsplash.com'
		},
		{
			alt: 'Cristina Gottardi',
			src: 'https://i1.wp.com/siliconbayounews.com/wp-content/uploads/2019/10/Scale.jpg?fit=2500%2C1668&ssl=1',
			title: 'cristina-gottardi-CSpjU6hYo_0-unsplash.com'
		},
		{
			alt: 'Johannes Plenio',
			src: 'https://coworker.imgix.net/photos/united-states/louisiana/new-orleans/the-shop-at-the-contemporary-arts-center/3-1549572912.jpg',
			title: 'johannes-plenio-RwHv7LgeC7s-unsplash.com'
		}
	];
</script>

<Carousel {images} duration="{5000}" let:Controls>
	<Controls />
</Carousel>
