<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';

	interface PathSegment {
		name: string;
		href: string;
	}

	const homePath = '/';
	let pathSegments: PathSegment[] = [];

	const capitalizeSegment = (segment: string) => {
		if (segment === 'group') return 'Group';
		return segment
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	};

	$: if ($page) {
		const pathArray = $page.url.pathname.split('/').filter(Boolean);
		pathSegments = pathArray.map((segment, index): PathSegment => {
			const href = '/' + pathArray.slice(0, index + 1).join('/');
			const name = capitalizeSegment(segment);
			return { name, href };
		});
	}
</script>

<Breadcrumb aria-label="Dynamic breadcrumb" navClass="hidden lg:flex">
	<BreadcrumbItem
		href="{homePath}"
		home
		homeClass="text-gray-400 text-base font-medium inline-flex items-center dark:text-violet-100 hover:text-gray-600 dark:hover:text-violet-300"
		>Home</BreadcrumbItem
	>
	{#each pathSegments as segment, index (segment.href)}
		{#if segment.name.toLowerCase() === 'group'}
			<BreadcrumbItem>
				{segment.name}
			</BreadcrumbItem>
		{:else if index === pathSegments.length - 1}
			<BreadcrumbItem>{segment.name}</BreadcrumbItem>
		{:else}
			<BreadcrumbItem href="{segment.href}">{segment.name}</BreadcrumbItem>
		{/if}
	{/each}
</Breadcrumb>
