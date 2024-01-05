<script lang="ts">
	// get info from event
	let i = 0;
	$: i;
	setInterval(() => i++, 1000);
</script>

{i}
<h1>Event INFO</h1>
