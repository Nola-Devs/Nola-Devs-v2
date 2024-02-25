<script lang="ts">
	import { EnvelopeOutline, LinkOutline } from 'flowbite-svelte-icons';
	import {
		Discord,
		Eventbrite,
		Facebook,
		Github,
		Linkedin,
		Linktree,
		Meetup,
		Twitch,
		Twitter,
		Youtube
	} from 'svelte-simples';
	export let icon: string = '';
	export let size: number = 30;
	export let color: string = 'black';
	export let styles: string = '';
</script>

<div class="{styles}" style="height: {size}px; width: {size}px; color:{color};">
	{#if icon === 'linkedin'}
		<Linkedin class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'facebook'}
		<Facebook class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'meetup'}
		<Meetup class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'twitter'}
		<Twitter class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'github'}
		<Github class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'twitch'}
		<Twitch class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'eventbrite'}
		<Eventbrite class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'youtube'}
		<Youtube class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'linktr'}
		<Linktree class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'discord'}
		<Discord class="fill-inherit dark:fill-white w-full h-full" />
	{:else if icon === 'email'}
		<EnvelopeOutline class="text-color dark:text-white w-full h-full" />
	{:else}
		<LinkOutline class="text-color dark:text-white w-full h-full" />
	{/if}
</div>
