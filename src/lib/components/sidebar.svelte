<script lang="ts">
	import HomeIcon from '$lib/assets/icons/HomeIcon.svelte';
	import AddIcon from '$lib/assets/icons/AddIcon.svelte';
	import CalenderIcon from '$lib/assets/icons/CalenderIcon.svelte';
	import AboutIcon from '$lib/assets/icons/AboutIcon.svelte';
	export let data: any;
</script>

<aside class=" font-light hidden md:block fixed top-0 left-0 w-[200px] h-dvh">
	<div class="flex text-xs px-5 h-full flex-col items-center justify-between">
		<div class="flex gap-6 flex-col items-center justify-center pt-5">
			<div class="w-[100px]">
				<img
					class=" w-full object-cover"
					src="https://media.discordapp.net/attachments/1176561002926587904/1196553336682467390/image.png?ex=65c146a2&is=65aed1a2&hm=0f4fcc73aeba27d566eaf0b018ff440994b64e7e2a08a4b8298e6fb446a0559f&=&format=webp&quality=lossless&width=984&height=325"
					alt=""
				/>
			</div>
			<div class=" w-full flex flex-col text-xs">
				<a
					href="/"
					class="flex rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white items-center"
				>
					<HomeIcon />
					<p class="ms-5">Home</p>
				</a>
				<a
					class="flex rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white items-center"
					href="/"
				>
					<CalenderIcon />
					<p class="ms-5">Calender Feed</p>
				</a>
				<a
					href="/"
					class="flex rounded-md py-1.5 text-blue-500 px-2 hover:bg-blue-500 hover:text-white items-center"
				>
					<AddIcon />
					<p class="ms-5">Add Event</p>
				</a>
				<div class="pt-4">
					<p class=" uppercase text-gray-400 text-[10px]">Local Groups</p>
					<div class="pt-1 flex flex-col">
						{#each data.groups as group}
							<a
								href="/group/{group?.replace(/[ ]/g, '-')}"
								class="flex rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white items-center"
							>
								<CalenderIcon />
								<p class="ms-5">
									{group}
								</p>
							</a>
						{/each}
					</div>
				</div>
				<div class="pt-5">
					<p class=" uppercase text-gray-400 text-[10px]">Org Info</p>
					<div class="flex flex-col pt-1">
						<a
							href="/"
							class="flex rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white items-center"
						>
							<AboutIcon />

							<p class="ms-5">About us</p>
						</a>
						<div>
							<a
								class="flex rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white items-center"
								href="/"
							>
								<AddIcon />
								<p class="ms-5">Contact us</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="py-5 text-center">
			<p class="relative text-gray-400">Nola Devs&trade; 2024</p>
		</div>
	</div>
</aside>
