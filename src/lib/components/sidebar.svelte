<script lang="ts">
	import {
		Sidebar,
		SidebarWrapper,
		SidebarGroup,
		DarkMode,
		SidebarItem,
		Heading
	} from 'flowbite-svelte';

	export let groups: string[];
</script>

<Sidebar asideClass="h-full top-24 fixed max-sm:hidden ">
	<SidebarWrapper divClass="ml-2">
		<SidebarGroup>
			<Heading tag="h2" customSize="text-lg">Tech Groups</Heading>
			{#each groups as group}
				<SidebarItem
					class="text-xs p-1 ml-3"
					label="{group}"
					href="{'/group/' + group.replace(/ /g, '-')}"
				/>
			{/each}
		</SidebarGroup>

		<SidebarGroup ulClass="fixed bottom-0 p-3 w-fit">
			<DarkMode />
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
