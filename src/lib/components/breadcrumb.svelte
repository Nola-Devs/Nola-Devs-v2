<script lang="ts">
    import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
    import { page } from '$app/stores'; 

    interface PathSegment {
      name: string;
      href: string;
    }
  
    const homePath = '/';
    let pathSegments: PathSegment[] = [];
  
    $: if ($page) {
      const pathArray = $page.url.pathname.split('/').filter(Boolean);
      pathSegments = pathArray.map((segment, index): PathSegment => {
        const href = '/' + pathArray.slice(0, index + 1).join('/');
        return { name: segment, href };
      });
    }
  </script>
  
  <Breadcrumb aria-label="Dynamic breadcrumb example">
    <BreadcrumbItem href="{homePath}" home>Home</BreadcrumbItem>
    {#each pathSegments as segment, index (segment.href)}
      {#if index === pathSegments.length - 1}
        <BreadcrumbItem>{segment.name}</BreadcrumbItem>
      {:else}
        <BreadcrumbItem href="{segment.href}">{segment.name}</BreadcrumbItem>
      {/if}
    {/each}
  </Breadcrumb>
  