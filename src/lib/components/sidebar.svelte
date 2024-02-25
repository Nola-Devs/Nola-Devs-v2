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

<Sidebar>
	<SidebarWrapper divClass="ml-2">
		<SidebarGroup ulClass="mt-16">
			<Heading tag="h2" customSize="text-lg">Groups</Heading>
			{#each groups as group}
				<SidebarItem
					class="text-xs p-1 ml-3"
					label="{group}"
					href="{'/group/' + group.replace(/ /g, '-')}"
				/>
			{/each}
		</SidebarGroup>

		<SidebarGroup ulClass="mt-14">
			<Heading tag="h2" customSize="text-lg">Meet The</Heading>
			<SidebarItem class="text-xs p-1 ml-3" label="Organizers" href="/" />
			<SidebarItem class="text-xs p-1 ml-3" label="Dev/Design Team" href="/" />
			<SidebarItem class="text-xs p-1 ml-3" label="Contributors" href="/contributors" />
		</SidebarGroup>

		<SidebarGroup ulClass="mt-14">
			<Heading tag="h2" customSize="text-lg">Other Links</Heading>
			<SidebarItem class="text-xs p-1 ml-3" label="Mission Statement" href="/" />
			<SidebarItem class="text-xs p-1 ml-3" label="Sponsors" href="/" />
			<SidebarItem class="text-xs p-1 ml-3" label="Contact" href="/" />
			<SidebarItem class="text-xs p-1 ml-3" label="Submit An Event" href="/" />
		</SidebarGroup>

		<SidebarGroup ulClass="fixed bottom-0 p-3 w-fit">
			<DarkMode />
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
