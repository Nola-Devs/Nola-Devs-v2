<script lang="ts">
  import type { LayoutData } from './$types';
  export let data: LayoutData
</script>


<nav>
  {#each data.groups as group}
    <a href="/admin/{group?.replace(/ /g, '-' )}">
      <p>{group}</p>
    </a>
  {/each}
  
</nav>



<slot/>