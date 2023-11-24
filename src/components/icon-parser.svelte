<script lang="ts">
	import FaLinkedin from 'svelte-icons/fa/FaLinkedin.svelte';
	import FaMeetup from 'svelte-icons/fa/FaMeetup.svelte';
	import FaTwitter from 'svelte-icons/fa/FaTwitter.svelte';
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte';
	import FaTwitch from 'svelte-icons/fa/FaTwitch.svelte';
	import FaYoutube from 'svelte-icons/fa/FaYoutube.svelte';
	import MdEmail from 'svelte-icons/md/MdEmail.svelte';
	import FaGlobe from 'svelte-icons/fa/FaGlobe.svelte';
	import FaLink from 'svelte-icons/fa/FaLink.svelte';

	type icons =
		| 'linkedin'
		| 'meetup'
		| 'twitter'
		| 'github'
		| 'twitch'
		| 'eventbrite'
		| 'youtube'
		| 'linktr'
		| 'email'
		| 'website'
		| '';
	export let icon: icons = '';
	export let size: number = 50;
	export let color: string = 'black';
</script>

<div style="height: {size}px; width: {size}px; color:{color};">
	{#if icon === 'linkedin'}
		<FaLinkedin />
	{:else if icon === 'meetup'}
		<FaMeetup />
	{:else if icon === 'twitter'}
		<FaTwitter />
	{:else if icon === 'github'}
		<FaGithub />
	{:else if icon === 'twitch'}
		<FaTwitch />
	{:else if icon === 'eventbrite'}
		<svg fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10.542 5.81c2.653-.6 5.3.487 6.775 2.54L5.591 11c.405-2.479 2.298-4.591 4.951-5.19zm6.84 9.746a6.47 6.47 0 01-3.919 2.634c-2.67.604-5.335-.501-6.804-2.582l11.763-2.657 1.915-.433L24 11.691a11.57 11.57 0 00-.305-2.333C22.205 3.04 15.76-.9 9.303.558 2.846 2.017-1.18 8.322.31 14.642c1.491 6.319 7.935 10.259 14.392 8.8 3.805-.86 6.765-3.402 8.25-6.638z"
			/>
		</svg>
	{:else if icon === 'youtube'}
		<FaYoutube />
	{:else if icon === 'linktr'}
		<svg fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M13.736 5.853l4.005-4.117 2.325 2.38-4.2 4.005h5.908v3.305h-5.937l4.229 4.108-2.325 2.334-5.74-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2.226V8.121h5.909l-4.2-4.004 2.324-2.381 4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z"
			/>
		</svg>
	{:else if icon === 'email'}
		<MdEmail />
	{:else if icon === 'website'}
		<FaGlobe />
	{:else}
		<FaLink />
	{/if}
</div>
