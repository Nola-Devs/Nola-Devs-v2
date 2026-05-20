<script lang="ts">
	import EventBanner from '$lib/components/banners/event-banner.svelte';
	import Icon from '$lib/components/icon/index.svelte';
	import OrganizerList from '$lib/components/organizer-list.svelte';
	import RsvpForm from '$lib/components/rsvp-form.svelte';
	import { page } from '$app/stores';

	import { Sanitizer } from '$lib/utils/sanitize';
	import type { PageData } from './$types';
	export let data: PageData;

	if (!data?.event) throw new Error('Event not found');

	const { event } = data;
	const { groupName, meetupName, description, start, end, location } = event;

	const startDateTime = new Date(start);
	const endDateTime = new Date(end);

	function formatDateComponents(date: Date) {
		const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
		const month = date.toLocaleDateString('en-US', { month: 'long' });
		const day = date.toLocaleDateString('en-US', { day: 'numeric' });
		return { weekday, month, day };
	}

	const formatTime = (date: Date) => {
		return date
			.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			})
			.replace(' ', '');
	};

	const {
		weekday: startWeekday,
		month: startMonth,
		day: startDay
	} = formatDateComponents(startDateTime);
	const { weekday: endWeekday, month: endMonth, day: endDay } = formatDateComponents(endDateTime);
	const formattedStartTime = formatTime(startDateTime);
	const formattedEndTime = formatTime(endDateTime);

	const isSameDay =
		startDateTime.getFullYear() === endDateTime.getFullYear() &&
		startDateTime.getMonth() === endDateTime.getMonth() &&
		startDateTime.getDate() === endDateTime.getDate();

	const isSameMonth = (a: Date, b: Date) => (a.getMonth() === b.getMonth() ? '' : `${endMonth}`);

	let dateTimeDisplay = isSameDay
		? `${startWeekday}, ${startMonth} ${startDay} ${formattedStartTime} - ${formattedEndTime}`
		: `${startWeekday}, ${startMonth} ${startDay} ${formattedStartTime} -
		${endWeekday}, ${endMonth} ${endDay} ${formattedEndTime}`;

	const { name: place, street, city, state, zip } = location;
	const address = [street, city, state, zip].filter(Boolean).join(', ');

	const googleMapsSearchUrl = address
		? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
		: '';
</script>

<div class="flex flex-col md:flex-row md:gap-8 flex-1">
	<section class="flex flex-col w-full md:w-3/4 gap-6">
		<EventBanner
			title="{meetupName || 'Group Name'}"
			subtitle="{'Hosted by ' + groupName}"
			description="{dateTimeDisplay}"
			ctaText="Add to My Calendar"
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
							{isSameDay
								? `${startMonth} ${startDay}`
								: `${startMonth} ${startDay} - ${isSameMonth(startDateTime, endDateTime)} ${endDay}`}
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
						</a>
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
						</a>
					</li>
				</ul>
			</div>
		</div>
		<RsvpForm
			eventSlug="{$page.params.eventID}"
			totalHeadcount="{data.rsvpSummary?.totalHeadcount ?? 0}"
		/>
		<OrganizerList organizers="{data.users}" />
	</aside>
</div>
