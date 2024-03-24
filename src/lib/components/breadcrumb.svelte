<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';

	interface PathSegment {
		name: string;
		href?: string;
	}

	const homePath = '/';
	let pathSegments: PathSegment[] = [];

	const capitalizeSegment = (segment: string) => {
		if (segment === 'group') return 'Group';
		if (segment === 'events') return 'Events';

		return segment
			.replace(/\d{8}/, (match) => {
				// Extract and format the date from the segment
				const year = match.substring(0, 4);
				const month = match.substring(4, 6);
				const day = match.substring(6, 8);
				return `${month}/${day}/${year}`;
			})
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	};

	$: if ($page) {
		const pathArray = $page.url.pathname.split('/').filter(Boolean);
		pathSegments = pathArray.map((segment, index): PathSegment => {
			const name = capitalizeSegment(segment);
			const href = index > 0 ? '/' + pathArray.slice(0, index + 1).join('/') : undefined;
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
		{#if segment.href}
			<BreadcrumbItem href="{segment.href}">{segment.name}</BreadcrumbItem>
		{:else}
			<BreadcrumbItem>{segment.name}</BreadcrumbItem>
		{/if}
	{/each}
</Breadcrumb>
