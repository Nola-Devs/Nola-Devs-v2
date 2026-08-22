import { SLACK_BOT_TOKEN } from '$env/static/private';
import { WebClient } from '@slack/web-api';
import { json } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
import EventLocationModel from '$lib/db/models/event-locations.model';
import EventModel from '$lib/db/models/events.model';
import {
	buildCreateEventModalBlocks,
	buildCancelEventModalBlocks,
	buildAnnouncementBlocks,
	collectEventMessages,
	createEventOptions,
	createGroupOptions,
	createLocationOptions,
	getDateTimeValue,
	getInputValue,
	getSelectValue
} from '$lib/utils/eventbot';
import { postEventAuditLog } from '$lib/utils/eventbot-audit';
import { listBotChannels } from '$lib/utils/eventbot-channels';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { Group } from '$lib/types/group';
import slugify from 'slugify';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const formData = await request.formData();
	const payloadString = formData.get('payload') as string;

	if (!payloadString) {
		return json({ error: 'No payload found' }, { status: 400 });
	}

	const payload = JSON.parse(payloadString);
	const state = payload.view.state;

	let metadata;
	try {
		metadata =
			typeof payload.view.private_metadata === 'string'
				? JSON.parse(payload.view.private_metadata)
				: payload.view.private_metadata;
	} catch (err) {
		console.error('Metadata parse error:', err);
		return new Response('', { status: 200 });
	}

	if (payload.type === 'block_actions') {
		const action = payload.actions[0];

		if (action.action_id === 'create_event') {
			const groups: Group[] = await GroupModel.find({}, 'group slug');
			const groupOptions = createGroupOptions(groups);
			const locations = await EventLocationModel.find({});
			const locationOptions = createLocationOptions(locations);
			// re-fetched on every rebuild rather than stashed, private_metadata caps at 3000 chars
			const { options: channelOptions } = await listBotChannels(slackClient);

			const updatedMetadata = {
				...metadata,
				groups,
				locations,
				showOtherGroupField: false,
				showOtherLocationFields: false,
				showAnnouncementFields: false
			};

			await slackClient.views.push({
				trigger_id: payload.trigger_id,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks: buildCreateEventModalBlocks({
						groups: groupOptions,
						locations: locationOptions,
						channels: channelOptions,
						postChannelId: null,
						showOtherGroupField: updatedMetadata.showOtherGroupField,
						showOtherLocationFields: updatedMetadata.showOtherLocationFields,
						showAnnouncementFields: updatedMetadata.showAnnouncementFields
					})
				}
			});
		}

		if (action.action_id === 'group_select') {
			const selectedGroup = action.selected_option.value;
			const groupOptions = createGroupOptions(metadata.groups);
			const locationOptions = createLocationOptions(metadata.locations);
			const { options: channelOptions } = await listBotChannels(slackClient);

			const updatedMetadata = {
				...metadata,
				showOtherGroupField: selectedGroup === 'other-group',
				showOtherLocationFields: metadata.showOtherLocationFields,
				showAnnouncementFields: metadata.showAnnouncementFields
			};

			const blocks = buildCreateEventModalBlocks({
				groups: groupOptions,
				locations: locationOptions,
				channels: channelOptions,
				postChannelId: getSelectValue(state, 'post_channel_block', 'post_channel_select'),
				showOtherGroupField: updatedMetadata.showOtherGroupField,
				showOtherLocationFields: updatedMetadata.showOtherLocationFields,
				showAnnouncementFields: updatedMetadata.showAnnouncementFields
			});

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks
				}
			});
		}

		if (action.action_id === 'location_select') {
			const selectedLocation = action.selected_option.value;
			const groupOptions = createGroupOptions(metadata.groups);
			const locationOptions = createLocationOptions(metadata.locations);
			const { options: channelOptions } = await listBotChannels(slackClient);

			const updatedMetadata = {
				...metadata,
				showOtherGroupField: metadata.showOtherGroupField,
				showOtherLocationFields: selectedLocation === 'other-location',
				showAnnouncementFields: metadata.showAnnouncementFields
			};

			const blocks = buildCreateEventModalBlocks({
				groups: groupOptions,
				locations: locationOptions,
				channels: channelOptions,
				postChannelId: getSelectValue(state, 'post_channel_block', 'post_channel_select'),
				showOtherGroupField: updatedMetadata.showOtherGroupField,
				showOtherLocationFields: updatedMetadata.showOtherLocationFields,
				showAnnouncementFields: updatedMetadata.showAnnouncementFields
			});

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks
				}
			});
		}

		if (action.action_id === 'post_channel_select') {
			const selectedPostChannel: string | null = action.selected_option?.value ?? null;
			const groupOptions = createGroupOptions(metadata.groups);
			const locationOptions = createLocationOptions(metadata.locations);
			const { options: channelOptions } = await listBotChannels(slackClient);

			// the announcement message and the repost picker are only meaningful once
			// a post channel is chosen, so they stay hidden until then
			const updatedMetadata = {
				...metadata,
				showOtherGroupField: metadata.showOtherGroupField,
				showOtherLocationFields: metadata.showOtherLocationFields,
				showAnnouncementFields: Boolean(selectedPostChannel)
			};

			const blocks = buildCreateEventModalBlocks({
				groups: groupOptions,
				locations: locationOptions,
				channels: channelOptions,
				postChannelId: selectedPostChannel,
				showOtherGroupField: updatedMetadata.showOtherGroupField,
				showOtherLocationFields: updatedMetadata.showOtherLocationFields,
				showAnnouncementFields: updatedMetadata.showAnnouncementFields
			});

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'create_event_modal',
					private_metadata: JSON.stringify(updatedMetadata),
					title: {
						type: 'plain_text',
						text: 'Create an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Submit'
					},
					close: {
						type: 'plain_text',
						text: 'Cancel'
					},
					blocks
				}
			});
		}

		if (action.action_id === 'edit_event') {
			// then do this
		}

		if (action.action_id === 'event_select') {
			const selectedEventId: string | null = action.selected_option?.value ?? null;

			const upcomingEvents = await EventModel.find({ end: { $gte: new Date() } })
				.sort({ start: 1 })
				.limit(100);

			// the cleanup checkbox is only worth showing once we know the chosen event
			// actually has posts behind it
			const selectedEvent = upcomingEvents.find(
				(event: { _id: unknown }) => String(event._id) === selectedEventId
			);

			await slackClient.views.update({
				view_id: payload.view.id,
				hash: payload.view.hash,
				view: {
					type: 'modal',
					callback_id: 'cancel_event_modal',
					private_metadata: JSON.stringify(metadata),
					title: {
						type: 'plain_text',
						text: 'Cancel an Event'
					},
					submit: {
						type: 'plain_text',
						text: 'Cancel Event'
					},
					close: {
						type: 'plain_text',
						text: 'Close'
					},
					blocks: buildCancelEventModalBlocks({
						events: createEventOptions(upcomingEvents),
						selectedEventId,
						postCount: collectEventMessages(selectedEvent).length
					})
				}
			});
		}

		if (action.action_id === 'cancel_event') {
			// events that have already ended cannot be cancelled, but one in progress still can be
			const upcomingEvents = await EventModel.find({ end: { $gte: new Date() } })
				.sort({ start: 1 })
				.limit(100);
			const eventOptions = createEventOptions(upcomingEvents);

			const hasEvents = eventOptions.length > 0;

			await slackClient.views.push({
				trigger_id: payload.trigger_id,
				view: {
					type: 'modal',
					callback_id: 'cancel_event_modal',
					private_metadata: JSON.stringify(metadata),
					title: {
						type: 'plain_text',
						text: 'Cancel an Event'
					},
					...(hasEvents
						? {
								submit: {
									type: 'plain_text' as const,
									text: 'Cancel Event'
								}
							}
						: {}),
					close: {
						type: 'plain_text',
						text: 'Close'
					},
					blocks: buildCancelEventModalBlocks({ events: eventOptions })
				}
			});
		}
	}

	if (payload.type === 'view_submission' && payload.view.callback_id === 'create_event_modal') {
		const state = payload.view.state;

		const title = getInputValue(state, 'title_block', 'title_input');
		const description = getInputValue(state, 'description_block', 'description_input');
		const startTime = getDateTimeValue(state, 'starttime_block', 'datetimepicker_start');
		const endTime = getDateTimeValue(state, 'endtime_block', 'datetimepicker_end');
		const eventLink = getInputValue(state, 'event_block', 'event_input');
		const rsvpLink = getInputValue(state, 'rsvp_block', 'rsvp_input');
		const locationNotes = getInputValue(state, 'location_notes_block', 'location_notes_input');
		const announcement = getInputValue(state, 'announcement_block', 'announcement_input');

		// Post In is optional and has no fallback: leaving it empty saves the event
		// without announcing it anywhere
		const postChannelId = getSelectValue(state, 'post_channel_block', 'post_channel_select');
		const repostChannelIds: string[] = (
			state.values?.repost_channels_block?.repost_channels_select?.selected_options ?? []
		)
			.map((option: any) => option.value)
			.filter((channelId: string) => channelId !== postChannelId);

		const selectedGroup =
			state.values?.group_section_block?.group_select?.selected_option?.value ?? null;
		const selectedLocation =
			state.values?.location_section_block?.location_select?.selected_option?.value ?? null;

		let groupName;
		let locationName = getInputValue(state, 'location_name_block', 'street_address_input');
		let streetAddress = getInputValue(state, 'street_address_block', 'street_address_input');
		let locationCity = getInputValue(state, 'city_block', 'city_input');
		let locationState = getInputValue(state, 'state_block', 'state_input');
		let locationZip = getInputValue(state, 'zip_block', 'zip_input');

		if (selectedGroup !== 'other-group') {
			const { group } = await GroupModel.findOne({ slug: selectedGroup }, 'group');
			groupName = group;
		} else {
			groupName = getInputValue(state, 'other_group_block', 'other_group_input');
		}

		if (selectedLocation !== 'other-location') {
			const { name, street, city, state, zip } = await EventLocationModel.findOne({
				slug: selectedLocation
			});

			locationName = name;
			streetAddress = street;
			locationCity = city;
			locationState = state;
			locationZip = zip;
		}

		const startDate = new Date(startTime * 1000);
		const endDate = new Date(endTime * 1000);

		// complete event data from slack modal
		const eventData = {
			title,
			groupSlug: selectedGroup === 'other-group' ? 'other-group' : selectedGroup,
			groupName,
			description,
			startTime: startDate,
			endTime: endDate,
			eventLink,
			rsvpLink,
			locationSlug: selectedLocation,
			locationName,
			streetAddress,
			locationCity,
			state: locationState,
			locationZip,
			locationNotes,
			announcement,
			channelId: postChannelId,
			createdBy: metadata.user_id,
			createdAt: new Date()
		};

		const setExpireAt = (eventEnd: Date) => {
			const expirationDate = new Date(eventEnd);
			expirationDate.setUTCDate(expirationDate.getUTCDate() + 1);
			expirationDate.setUTCHours(0);
			return expirationDate;
		};

		const eventSlug = slugify(`${groupName} ${eventData.startTime}`, {
			replacement: '-',
			lower: true,
			locale: 'en'
		});

		// save to MongoDB
		const newEvent: Event = {
			groupSlug: eventData.groupSlug,
			groupName,
			meetupName: eventData.title,
			description: eventData.description,
			start: eventData.startTime,
			end: eventData.endTime,
			expireAt: setExpireAt(eventData.endTime),
			location: {
				name: eventData.locationName,
				street: eventData.streetAddress,
				city: eventData.locationCity,
				state: eventData.state,
				zip: eventData.locationZip,
				slug: eventData.locationSlug
			},
			locationNotes: eventData.locationNotes,
			eventLink: eventData.eventLink,
			rsvpLink: eventData.rsvpLink,
			announcement: eventData.announcement,
			eventSlug,
			createdAt: eventData.createdAt
		};

		let createdEvent;
		try {
			createdEvent = await EventModel.create(newEvent);
		} catch (e) {
			console.error('Error saving to database', e);
		}

		// post the announcement, then hold on to where it landed so it can be
		// edited in place later. no Post In channel means the event is saved silently
		let announcementPermalink;
		if (postChannelId) {
			try {
				const posted = await slackClient.chat.postMessage({
					channel: postChannelId,
					text: `New event: ${title}`, // fallback for notifications
					blocks: buildAnnouncementBlocks(eventData)
				});

				if (posted.ts) {
					const announcementChannel = posted.channel ?? postChannelId;

					const permalink = await slackClient.chat.getPermalink({
						channel: announcementChannel,
						message_ts: posted.ts
					});
					announcementPermalink = permalink.permalink;

					if (createdEvent) {
						createdEvent.announcementChannel = announcementChannel;
						createdEvent.announcementTs = posted.ts;
						await createdEvent.save();
					}
				}
			} catch (err) {
				console.error('Failed to post announcement:', err);
			}
		}

		// reposts are links rather than copies, so there is only ever one message to
		// edit. where each link landed is stored so cancelling can clean them up
		if (announcementPermalink) {
			const reposts: Array<{ channel: string; ts: string }> = [];

			for (const channelId of repostChannelIds) {
				try {
					const reposted = await slackClient.chat.postMessage({
						channel: channelId,
						// bare permalink so slack unfurls the announcement itself
						text: announcementPermalink,
						unfurl_links: true
					});

					if (reposted.ts) {
						reposts.push({ channel: reposted.channel ?? channelId, ts: reposted.ts });
					}
				} catch (err) {
					console.error(`Failed to repost announcement in ${channelId}:`, err);
				}
			}

			if (createdEvent && reposts.length) {
				createdEvent.reposts = reposts;
				await createdEvent.save();
			}
		} else if (postChannelId && repostChannelIds.length) {
			console.error('Skipped reposts: the announcement has no permalink to link to.');
		}

		// audit trail, only on a successful write
		if (createdEvent) {
			await postEventAuditLog(slackClient, {
				operation: 'create',
				userId: payload.user?.id ?? metadata.user_id,
				before: null,
				after: createdEvent
			});
		}

		// return success modal (replaces the form)
		return json({
			response_action: 'update',
			view: {
				type: 'modal',
				title: { type: 'plain_text', text: 'Event Created! 🎉' },
				close: { type: 'plain_text', text: 'Close' },
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: postChannelId
								? `*${title}* has been saved and announced in <#${postChannelId}>.` +
									(repostChannelIds.length
										? ` Linked in ${repostChannelIds.map((id) => `<#${id}>`).join(', ')}.`
										: '')
								: `*${title}* has been saved, but not announced anywhere. Pick a channel under *Post In* to announce it.`
						}
					}
				]
			}
		});
	}

	if (payload.type === 'view_submission' && payload.view.callback_id === 'cancel_event_modal') {
		const state = payload.view.state;

		const selectedEventId =
			state.values?.event_section_block?.event_select?.selected_option?.value ?? null;
		const confirmed =
			(state.values?.cancel_confirm_block?.cancel_confirm_input?.selected_options ?? []).length > 0;
		const reason = getInputValue(state, 'cancel_reason_block', 'cancel_reason_input');
		const deletePosts =
			(state.values?.cancel_cleanup_block?.cancel_cleanup_input?.selected_options ?? []).length > 0;

		// the select is a section accessory, so slack does not validate it for us
		if (!selectedEventId || !confirmed) {
			const upcomingEvents = await EventModel.find({ end: { $gte: new Date() } })
				.sort({ start: 1 })
				.limit(100);

			return json({
				response_action: 'update',
				view: {
					type: 'modal',
					callback_id: 'cancel_event_modal',
					private_metadata: JSON.stringify(metadata),
					title: { type: 'plain_text', text: 'Cancel an Event' },
					submit: { type: 'plain_text', text: 'Cancel Event' },
					close: { type: 'plain_text', text: 'Close' },
					blocks: buildCancelEventModalBlocks({
						events: createEventOptions(upcomingEvents),
						selectedEventId,
						postCount: collectEventMessages(
							upcomingEvents.find(
								(event: { _id: unknown }) => String(event._id) === selectedEventId
							)
						).length,
						isMissingField: true
					})
				}
			});
		}

		let cancelledEvent;
		try {
			cancelledEvent = await EventModel.findByIdAndDelete(selectedEventId);
		} catch (e) {
			console.error('Error deleting from database', e);
		}

		// the event was already removed, or the id no longer resolves
		if (!cancelledEvent) {
			return json({
				response_action: 'update',
				view: {
					type: 'modal',
					title: { type: 'plain_text', text: 'Event Not Found' },
					close: { type: 'plain_text', text: 'Close' },
					blocks: [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: 'That event could not be found. It may have already been cancelled.'
							}
						}
					]
				}
			});
		}

		// audit trail, only on a successful delete
		await postEventAuditLog(slackClient, {
			operation: 'delete',
			userId: payload.user?.id ?? metadata.user_id,
			before: cancelledEvent,
			after: null,
			reason
		});

		// the announcement and every link back to it are stale once the event is
		// gone, so removing them is what tells the channel, in place of a notice
		const postedMessages = deletePosts ? collectEventMessages(cancelledEvent) : [];

		let deletedCount = 0;

		for (const { channel, ts } of postedMessages) {
			try {
				await slackClient.chat.delete({ channel, ts });
				deletedCount += 1;
			} catch (err) {
				console.error(`Failed to delete event message in ${channel}:`, err);
			}
		}

		return json({
			response_action: 'update',
			view: {
				type: 'modal',
				title: { type: 'plain_text', text: 'Event Cancelled' },
				close: { type: 'plain_text', text: 'Close' },
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text:
								`*${cancelledEvent.meetupName}* has been removed from noladevs.org.` +
								(deletedCount
									? ` Deleted ${deletedCount} slack ${deletedCount === 1 ? 'post' : 'posts'}.`
									: '')
						}
					}
				]
			}
		});
	}

	return new Response('see payload', { status: 200 });
};
