<script>
	import { slide } from 'svelte/transition';
	import { bounceOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	export const gallery_items = [
		{
			url: 'https://res.cloudinary.com/beswift/image/upload/v1650390102/photo-1649894222226-056a1a79d9fb_xlv73h.jpg',
			description: 'Dog'
		},
		{
			url: 'https://res.cloudinary.com/beswift/image/upload/v1650391131/photo-1648800475313-2bb7fbec8701_ae60yw.jpg',
			description: 'Building'
		},
		{
			url: 'https://res.cloudinary.com/beswift/image/upload/v1650391337/photo-1647067867267-e01d98462f3c_ugtnwe.jpg',
			description: 'Staircase'
		},
		{
			url: 'https://res.cloudinary.com/beswift/image/upload/v1650391490/photo-1644241687200-eadaf7601290_xcz2kh.jpg',
			description: 'Staircase'
		}
	];
	let currentSlideItem = 0;
	const nextImage = () => {
		currentSlideItem = (currentSlideItem + 1) % gallery_items.length;
	};
	onMount(() => setInterval(nextImage, 5000));
</script>

{#key [gallery_items[currentSlideItem]]}
	{#each [gallery_items[currentSlideItem]] as item (currentSlideItem)}
		<img
			transition:slide="{{ duration: 300, easing: bounceOut }}"
			src="{item.url}"
			alt="{item.description}"
			width="{300}"
			height="{300}"
		/>
	{/each}
{/key}

<style>
	img {
		width: 100%;
		height: 400px;
		object-fit: cover;
	}
</style>
