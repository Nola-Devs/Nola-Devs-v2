<script lang="ts">
	import { Button, Input, Label, Card } from 'flowbite-svelte';

	export let eventSlug: string;
	export let totalHeadcount: number;

	let email = '';
	let name = '';
	let headcount = 1;
	let slices = 2;
	let submitting = false;
	let editToken: string | null = null;
	let alreadyRsvpd = false;
	let errorMsg: string | null = null;

	$: editUrl = editToken ? `${location?.origin ?? ''}/event/${eventSlug}#rsvp-${editToken}` : null;

	function selectAll(e: Event) {
		(e.target as HTMLInputElement).select();
	}

	async function submit() {
		submitting = true;
		errorMsg = null;
		try {
			const res = await fetch(`/event/${eventSlug}/rsvp`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, name, headcount, slices })
			});
			if (!res.ok) {
				const text = await res.text();
				errorMsg = text || `Error ${res.status}`;
				return;
			}
			const body = await res.json();
			if (body.alreadyRsvpd) {
				alreadyRsvpd = true;
				return;
			}
			editToken = body.editToken;
			if (body.created) totalHeadcount += headcount;
		} catch (e) {
			errorMsg = 'Network error';
		} finally {
			submitting = false;
		}
	}
</script>

<Card class="w-full">
	<div class="p-4 flex flex-col gap-3">
		<h3
			class="font-semibold text-lg border-b border-violet-200 text-[#24072F] dark:text-violet-100 pb-3"
		>
			RSVP
		</h3>
		<p class="text-sm text-gray-600 dark:text-violet-300">
			{totalHeadcount}
			{totalHeadcount === 1 ? 'person' : 'people'} going
		</p>

		{#if editToken}
			<div class="text-sm text-green-700 dark:text-green-300">
				Thanks! You're on the list. Bookmark this link to change or cancel:
			</div>
			<input
				readonly
				class="text-xs p-2 border rounded bg-gray-50 dark:bg-gray-800"
				value="{editUrl}"
				on:click="{selectAll}"
			/>
		{:else if alreadyRsvpd}
			<div class="text-sm text-amber-700 dark:text-amber-300">
				An RSVP already exists for that email. Use the bookmark link from your original
				confirmation to change or cancel it. If you've lost the link, please contact the organizers.
			</div>
		{:else}
			<form on:submit|preventDefault="{submit}" class="flex flex-col gap-2">
				<Label for="rsvp-email">Email</Label>
				<Input
					id="rsvp-email"
					type="email"
					required
					bind:value="{email}"
					placeholder="you@example.com"
				/>

				<Label for="rsvp-name">Name (optional)</Label>
				<Input id="rsvp-name" type="text" bind:value="{name}" />

				<Label for="rsvp-headcount">Headcount (1–5)</Label>
				<Input
					id="rsvp-headcount"
					type="number"
					min="1"
					max="5"
					required
					bind:value="{headcount}"
				/>

				<Label for="rsvp-slices">Slices you'll eat (0–8)</Label>
				<Input id="rsvp-slices" type="number" min="0" max="8" required bind:value="{slices}" />

				{#if errorMsg}
					<div class="text-sm text-red-600">{errorMsg}</div>
				{/if}

				<Button type="submit" disabled="{submitting}" class="mt-2">
					{submitting ? 'Submitting…' : "I'm in"}
				</Button>
			</form>
		{/if}
	</div>
</Card>
