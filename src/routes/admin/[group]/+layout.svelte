<script lang="ts">
  import type { LayoutData } from './$types';
  export let data:LayoutData
</script>
{JSON.stringify(data)}
<slot/>