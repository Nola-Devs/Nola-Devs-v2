<script lang="ts">
	import { Button, Input, Label, Select, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: vendorItems = [
		{ value: '', name: '— None —' },
		...data.vendors.map((v) => ({ value: v._id ?? '', name: v.name }))
	];

	function downloadCsv() {
		const rows = [
			['email', 'name', 'headcount', 'slices', 'createdAt'],
			...data.rsvps.map((r) => [
				r.email,
				r.name ?? '',
				String(r.headcount),
				String(r.slices),
				new Date(r.createdAt).toISOString()
			])
		];
		const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `rsvps-${data.event.eventSlug}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="p-6 max-w-5xl mx-auto flex flex-col gap-6">
	<header>
		<h1 class="text-2xl font-bold">{data.event.meetupName}</h1>
		<p class="text-sm text-gray-600 dark:text-gray-300">
			{data.event.groupName} · {new Date(data.event.start).toLocaleString()}
		</p>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Card>
			<div class="p-4">
				<p class="text-xs uppercase text-gray-500">RSVPs</p>
				<p class="text-3xl font-semibold">{data.summary.totalRsvps}</p>
			</div>
		</Card>
		<Card>
			<div class="p-4">
				<p class="text-xs uppercase text-gray-500">Headcount</p>
				<p class="text-3xl font-semibold">{data.summary.totalHeadcount}</p>
			</div>
		</Card>
		<Card>
			<div class="p-4">
				<p class="text-xs uppercase text-gray-500">Slices claimed</p>
				<p class="text-3xl font-semibold">{data.summary.totalSlices}</p>
			</div>
		</Card>
	</div>

	<Card class="w-full">
		<div class="p-4 flex flex-col gap-2">
			<h2 class="text-lg font-semibold">Suggested order</h2>
			<p class="text-4xl font-bold">{data.calc.suggestedPies} pies</p>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Demand: {data.calc.demandSlices.toFixed(1)} slices · with {data.config.bufferMultiplier}× buffer:
				{data.calc.bufferedSlices.toFixed(1)} slices · {data.config.slicesPerPie} slices/pie
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Order by: <strong>{new Date(data.orderByAt).toLocaleString()}</strong>
			</p>
		</div>
	</Card>

	<Card class="w-full">
		<form method="post" action="?/saveConfig" class="p-4 flex flex-col gap-3">
			<h2 class="text-lg font-semibold">Pizza config</h2>

			<Label for="vendorId">Vendor</Label>
			<Select id="vendorId" name="vendorId" items="{vendorItems}" value="{data.config.vendorId ?? ''}" />

			<Label for="slicesPerPerson">Slices per person</Label>
			<Input
				id="slicesPerPerson"
				name="slicesPerPerson"
				type="number"
				step="0.1"
				min="0.5"
				max="10"
				value="{data.config.slicesPerPerson}"
				required
			/>

			<Label for="slicesPerPie">Slices per pie</Label>
			<Input
				id="slicesPerPie"
				name="slicesPerPie"
				type="number"
				min="1"
				max="24"
				value="{data.config.slicesPerPie}"
				required
			/>

			<Label for="leadTimeHours">Order lead time (hours before event)</Label>
			<Input
				id="leadTimeHours"
				name="leadTimeHours"
				type="number"
				min="0"
				max="168"
				value="{data.config.leadTimeHours}"
				required
			/>

			<Label for="bufferMultiplier">Buffer multiplier</Label>
			<Input
				id="bufferMultiplier"
				name="bufferMultiplier"
				type="number"
				step="0.05"
				min="1"
				max="3"
				value="{data.config.bufferMultiplier}"
				required
			/>

			<Button type="submit" class="mt-2">Save</Button>
		</form>
	</Card>

	<Card class="w-full">
		<div class="p-4 flex flex-col gap-3">
			<div class="flex justify-between items-center">
				<h2 class="text-lg font-semibold">RSVPs ({data.rsvps.length})</h2>
				<Button on:click="{downloadCsv}" disabled="{data.rsvps.length === 0}">
					Download CSV
				</Button>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full text-sm">
					<thead>
						<tr class="text-left border-b">
							<th class="py-2 pr-4">Email</th>
							<th class="py-2 pr-4">Name</th>
							<th class="py-2 pr-4">Headcount</th>
							<th class="py-2 pr-4">Slices</th>
							<th class="py-2 pr-4">Submitted</th>
						</tr>
					</thead>
					<tbody>
						{#each data.rsvps as r}
							<tr class="border-b">
								<td class="py-2 pr-4">{r.email}</td>
								<td class="py-2 pr-4">{r.name ?? ''}</td>
								<td class="py-2 pr-4">{r.headcount}</td>
								<td class="py-2 pr-4">{r.slices}</td>
								<td class="py-2 pr-4">{new Date(r.createdAt).toLocaleString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</Card>
</div>
