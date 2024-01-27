<script lang="ts">
	import HomeIcon from '$lib/assets/icons/HomeIcon.svelte';
	import AddIcon from '$lib/assets/icons/AddIcon.svelte';
	import CalenderIcon from '$lib/assets/icons/CalenderIcon.svelte';
	import AboutIcon from '$lib/assets/icons/AboutIcon.svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let isToggled = false;

	const menuTimeline = gsap.timeline({ paused: true });
	onMount(() => {
		menuTimeline.to('.line-1', { rotate: '45deg', y: '8px' });
		menuTimeline.to('.line-2', { scale: 0 }, '<');
		menuTimeline.to('.line-3', { rotate: '-45deg', y: '-8px' }, '<');
		menuTimeline.to('.menu', { y: '100dvh' }, '<');
	});

	function handleClick() {
		isToggled = !isToggled;

		if (isToggled) {
			menuTimeline.play();
			disableScroll();
		} else {
			menuTimeline.reverse();
			enableScroll();
		}
	}

	function disableScroll() {
		document.body.style.overflow = 'hidden';
	}
	function enableScroll() {
		document.body.style.overflow = 'auto';
	}

	export let data: any;
</script>

<div class="flex md:hidden w-full minh-hd">
	<div class=" flex h-full w-full px-6 py-2 md:hidden justify-between items-center relative">
		<div class="w-[200px] h-full flex items-center justify-center">
			<img
				class=" object-cover w-full"
				src="https://media.discordapp.net/attachments/1176561002926587904/1196553336682467390/image.png?ex=65c146a2&is=65aed1a2&hm=0f4fcc73aeba27d566eaf0b018ff440994b64e7e2a08a4b8298e6fb446a0559f&=&format=webp&quality=lossless&width=984&height=325"
				alt=""
			/>
		</div>
		<button on:click="{handleClick}" class="button w-[35px] z-[10] flex flex-col gap-1.5">
			<span class="line-1 border-black border w-full"></span>
			<span class="line-2 border-black border w-full"></span>
			<span class="line-3 border-black border w-full"></span>
		</button>
	</div>
	<div
		class="min-h-dvh w-full fixed z-[5] origin-top menu bg-gray-50 bottom-[100%] flex flex-col justify-center items-center left-0
    "
	>
		<div class="flex flex-col h-dvh px-6 py-6 w-full justify-between">
			<div class="w-[200px]">
				<img
					class=" w-full object-cover"
					src="https://media.discordapp.net/attachments/1176561002926587904/1196553336682467390/image.png?ex=65c146a2&is=65aed1a2&hm=0f4fcc73aeba27d566eaf0b018ff440994b64e7e2a08a4b8298e6fb446a0559f&=&format=webp&quality=lossless&width=984&height=325"
					alt=""
				/>
			</div>
			<div class=" w-full flex flex-col">
				<div
					class="flex rounded-md py-1.5 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
				>
					<HomeIcon />
					<a href="/" class="ms-5">Home</a>
				</div>
				<div
					class="flex rounded-md py-1.5 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
				>
					<CalenderIcon />
					<a href="/" class="ms-5">Calender Feed</a>
				</div>
				<div
					class="flex rounded-md py-1.5 text-blue-500 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
				>
					<AddIcon />
					<a href="/" class="ms-5">Add Event</a>
				</div>
				<div class="pt-4 font-thin">
					<p class=" uppercase text-gray-400 text-sm">Local Groups</p>
					<div class="pt-1 flex flex-col">
						{#each data.groups as group}
							<div
								class="flex rounded-md py-1.5 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
							>
								<CalenderIcon />
								<a class="ms-5" href="/group/{group?.replace(/[ ]/g, '-')}">
									<p>
										{group}
									</p>
								</a>
							</div>
						{/each}
					</div>
				</div>
				<div class="pt-5">
					<p class=" uppercase text-gray-400 text-sm">Org Info</p>
					<div class="flex flex-col pt-1">
						<div
							class="flex rounded-md py-1.5 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
						>
							<AboutIcon />
							<a href="/" class="ms-5">About us</a>
						</div>
						<div
							class="flex rounded-md py-1.5 px-2 font-thin hover:bg-blue-500 hover:text-white items-center"
						>
							<AddIcon />
							<a href="/" class="ms-5">Contact</a>
						</div>
					</div>
				</div>
			</div>
			<div class="py-5 text-center">
				<p class="relative text-gray-400">Nola Devs&trade; 2024</p>
			</div>
		</div>
	</div>
</div>
