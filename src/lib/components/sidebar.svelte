<script lang="ts">
	//import Icon from '$lib/components/icon/index.svelte';
	import { groupIconsMap } from '$lib/components/icon/icons';
	import { NavBrand } from 'flowbite-svelte';

	export let data: { groups: { name: string; slug: string; icon: string }[] };
</script>

<aside
	class="hidden lg:flex p-8 flex-col gap-12 w-full max-w-72 border-r border-[#EEE] dark:border-[#111827]"
>
	<NavBrand
		href="/"
		class="inline-flex items-center  font-cute text-5xl leading-10 text-gray-900 dark:text-violet-100"
	>
		N0LA<span class="text-[#6628CC]">{'[DEVS]'}</span>
	</NavBrand>

	<div class="w-full space-y-4">
		<h2 class="font-semibold leading-7 text-lg text-violet-500">Community Groups</h2>
		<ul class="list-none p-0 space-y-1.5">
			{#each data.groups as { name, slug, icon }}
				<li class="hover:bg-purple-700 rounded-lg group transition-colors">
					<a
						data-sveltekit-reload
						href="/group/{slug}"
						class="inline-flex items-center justify-start gap-3 py-2 px-4 text-base font-medium leading-[24px] group-hover:text-white text-gray-900 dark:text-white"
						aria-label="{`Group ${name}`}"
					>
						<!-- {#if groupIconsMap[slug]}
							<Icon
								name="{groupIconsMap[slug]}"
								size="{24}"
								className="text-gray-500 dark:text-violet-300 group-hover:text-white"
							/>
						{/if} -->
						<span class="text-base font-medium leading-[24px]">{icon} {name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>
