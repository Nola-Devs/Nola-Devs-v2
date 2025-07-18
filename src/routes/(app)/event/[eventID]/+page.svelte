<script lang="ts">
	import EventBanner from '$lib/components/banners/event-banner.svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import OrganizerList from '$lib/components/organizer-list.svelte';

	import { Sanitizer } from '$lib/utils/sanitize';
	import type { PageData } from './$types';
	export let data: PageData;

	if (!data?.event) throw new Error('Event not found');

	const { event } = data;
	const { summary, description, start, end, location, lnglat, group, calLink } = event;

	const startDateTime = new Date(start);
	const endDateTime = new Date(end);

	const isSameDay = startDateTime.toDateString() === endDateTime.toDateString();

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatTime = (date: Date) => {
		return date
			.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			})
			.replace(' ', '');
	};

	const formattedStartDate = formatDate(startDateTime);
	const formattedStartTime = formatTime(startDateTime);
	const formattedEndTime = formatTime(endDateTime);

	let dateTimeDisplay = isSameDay
		? `${formattedStartDate} • ${formattedStartTime} - ${formattedEndTime}`
		: `${formattedStartDate} • ${formattedStartTime} - ${formatDate(
				endDateTime
			)} ${formattedEndTime}`;

	const [place, ...addressParts] = location.split(', ');
	const address = addressParts.join(', ');

	const googleMapsSearchUrl = location
		? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
		: '';
</script>

<div class="flex flex-col md:flex-row md:gap-8 flex-1">
	<section class="flex flex-col w-full md:w-3/4 gap-6">
		<EventBanner
			title="{summary || 'Group Name'}"
			subtitle="{'Hosted by ' + group}"
			description="{dateTimeDisplay}"
			ctaText="Add to My Calendar"
			ctaLink="{calLink || '#'}"
			ctaIcon="downLoadIcon"
			linkText="Website"
			linkHref="{'#'}"
			linkIcon="linkIcon"
			bannerClass="bg-defaultBanner text-white"
			{event}
		/>
		<article class="flex flex-col md:flex-row gap-12 py-6 md:px-6 w-full">
			<section class="max-w-4xl min-h-36 text-[#24072F] dark:text-violet-100 space-y-3">
				<h3 class="font-semibold text-lg border-b border-violet-200 pb-4">Event Description</h3>
				<p class="text-base leading-6 dark:text-violet-200">
					<!-- eslint-disable svelte/no-at-html-tags -->
					{@html Sanitizer(description) || 'No description available'}
				</p>
			</section>
		</article>
	</section>

	<aside class="w-full md:w-[270px] 2xl:w-1/4 lg:px-6 flex flex-col gap-6">
		<div
			class="bg-white dark:bg-primary-dark border border-violet-200 dark:border-violet-950/50 shadow rounded-lg"
		>
			<div class=" p-6">
				<h3
					class="font-semibold text-lg border-b border-violet-200 text-[#24072F] dark:text-violet-100 pb-4"
				>
					When and Where
				</h3>
			</div>
			<div class="flex flex-col">
				<ul class="px-6 pb-6 space-y-4 text-violet-500">
					<li class="flex gap-3 items-center">
						<Icon name="calendarIcon" size="{24}" />
						<p class="text-sm md:text-base text-gray-800 dark:text-violet-200">
							{formattedStartDate}
						</p>
					</li>
					<li class="flex gap-3 items-center">
						<Icon name="clockIcon" size="{24}" />
						<p class="text-sm md:text-base text-gray-800 dark:text-violet-200">
							{formattedStartTime} - {formattedEndTime}
						</p>
					</li>
					<li class="flex gap-3 items-center">
						<Icon name="locationIcon" size="{24}" />
						<a
							href="{googleMapsSearchUrl}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm md:text-base underline text-gray-800 dark:text-violet-200"
							>
								{place}
							</a
						>
					</li>
					<li class="flex gap-3 items-center">
						<Icon name="addressIcon" className="w-7 h-7 md:w-11 md:h-11" />
						<a
							href="{googleMapsSearchUrl}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm md:text-base underline text-gray-800 dark:text-violet-200"
							>
								{address}
							</a
						>
					</li>
				</ul>
			</div>
		</div>
		<OrganizerList organizers="{data.users}" />
	</aside>
</div>
