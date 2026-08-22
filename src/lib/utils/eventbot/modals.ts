/**
 * The modals of the Slack Eventbot: building the two forms, and handling the
 * button presses and select changes that rebuild them.
 *
 * The flow only ever shows two forms — create and cancel — but each is opened,
 * pushed, and updated from several places, so the view scaffolding lives here
 * rather than being repeated at every call site.
 */

import type { ModalView, WebClient } from '@slack/web-api';
import EventLocationModel from '$lib/db/models/event-locations.model';
import EventModel from '$lib/db/models/events.model';
import GroupModel from '$lib/db/models/groups.model';
import {
	collectEventMessages,
	createEventOptions,
	createGroupOptions,
	createLocationOptions,
	getSelectValue
} from '$lib/utils/eventbot/helpers';
import {
	buildCancelEventModalBlocks,
	buildCreateEventModalBlocks
} from '$lib/utils/eventbot/blocks';
import { listBotChannels } from '$lib/utils/eventbot/channels';
import type { Group } from '$lib/types/group';

export const CREATE_EVENT_CALLBACK_ID = 'create_event_modal';
export const CANCEL_EVENT_CALLBACK_ID = 'cancel_event_modal';

// events that have already ended cannot be cancelled, one in progress still can be
const MAX_CANCELLABLE_EVENTS = 100;

/**
 * Everything carried between interactions in `private_metadata`. Slack caps that
 * field at 3000 characters, which is why the channel list is re-fetched on every
 * rebuild rather than stashed alongside the groups and locations.
 */
export type EventbotMetadata = {
	user_id?: string;
	groups?: Group[];
	locations?: unknown[];
	showOtherGroupField?: boolean;
	showOtherLocationFields?: boolean;
	showAnnouncementFields?: boolean;
};

type ModalViewOptions = {
	callbackId: string;
	title: string;
	submit?: string;
	close: string;
	metadata: EventbotMetadata;
	// block kit shapes vary too much between blocks for a useful inferred type
	blocks: unknown[];
};

const modalView = (options: ModalViewOptions) =>
	({
		type: 'modal',
		callback_id: options.callbackId,
		private_metadata: JSON.stringify(options.metadata),
		title: { type: 'plain_text', text: options.title },
		// a form with nothing to fill in gets no submit button
		...(options.submit ? { submit: { type: 'plain_text', text: options.submit } } : {}),
		close: { type: 'plain_text', text: options.close },
		blocks: options.blocks
	}) as ModalView;

/**
 * The create form. Flags come from the metadata so the caller decides what
 * changed, and the view stays a pure rendering of that decision.
 */
export const createEventView = async (
	slackClient: WebClient,
	metadata: EventbotMetadata,
	postChannelId: string | null = null
) => {
	// re-fetched on every rebuild rather than stashed, private_metadata caps at 3000 chars
	const { options: channels } = await listBotChannels(slackClient);

	return modalView({
		callbackId: CREATE_EVENT_CALLBACK_ID,
		title: 'Create an Event',
		submit: 'Submit',
		close: 'Cancel',
		metadata,
		blocks: buildCreateEventModalBlocks({
			groups: createGroupOptions(metadata.groups ?? []),
			locations: createLocationOptions(metadata.locations ?? []),
			channels,
			postChannelId,
			showOtherGroupField: metadata.showOtherGroupField,
			showOtherLocationFields: metadata.showOtherLocationFields,
			showAnnouncementFields: metadata.showAnnouncementFields
		})
	});
};

/**
 * The cancel form. The event list is always read fresh, since an event can end
 * or be cancelled elsewhere while the modal sits open.
 */
export const cancelEventView = async (
	metadata: EventbotMetadata,
	options: { selectedEventId?: string | null; isMissingField?: boolean } = {}
) => {
	const { selectedEventId = null, isMissingField = false } = options;

	const upcomingEvents = await EventModel.find({ end: { $gte: new Date() } })
		.sort({ start: 1 })
		.limit(MAX_CANCELLABLE_EVENTS);

	const events = createEventOptions(upcomingEvents);

	// the cleanup checkbox is only worth showing once we know the chosen event
	// actually has posts behind it
	const selectedEvent = upcomingEvents.find(
		(event: { _id: unknown }) => String(event._id) === selectedEventId
	);

	return modalView({
		callbackId: CANCEL_EVENT_CALLBACK_ID,
		title: 'Cancel an Event',
		submit: events.length ? 'Cancel Event' : undefined,
		close: 'Close',
		metadata,
		blocks: buildCancelEventModalBlocks({
			events,
			selectedEventId,
			postCount: collectEventMessages(selectedEvent).length,
			isMissingField
		})
	});
};

/**
 * Replaces the modal the interaction came from.
 */
export const updateModal = async (
	slackClient: WebClient,
	view: { id: string; hash?: string },
	updated: ModalView
) => {
	await slackClient.views.update({ view_id: view.id, hash: view.hash, view: updated });
};

/**
 * Stacks a modal on top of the one the interaction came from.
 */
export const pushModal = async (slackClient: WebClient, triggerId: string, view: ModalView) => {
	await slackClient.views.push({ trigger_id: triggerId, view });
};

/**
 * The terminal modals that replace the form once a submission is done. They only
 * ever say one thing, so they need no callback_id and no submit button.
 */
export const resultModal = (title: string, text: string) => ({
	response_action: 'update',
	view: {
		type: 'modal',
		title: { type: 'plain_text', text: title },
		close: { type: 'plain_text', text: 'Close' },
		blocks: [
			{
				type: 'section',
				text: { type: 'mrkdwn', text }
			}
		]
	}
});

type ActionContext = {
	slackClient: WebClient;
	// slack's block_actions payload
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any;
	// the action that fired, always payload.actions[0]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	action: any;
	metadata: EventbotMetadata;
};

/**
 * Re-renders the create form with one flag changed. The post channel is read
 * back off the modal state so it survives a rebuild triggered by another field.
 */
const rebuildCreateEventModal = async (
	context: ActionContext,
	changes: Partial<EventbotMetadata>,
	postChannelId?: string | null
) => {
	const { slackClient, payload, metadata } = context;

	const updatedMetadata = { ...metadata, ...changes };

	await updateModal(
		slackClient,
		payload.view,
		await createEventView(
			slackClient,
			updatedMetadata,
			postChannelId === undefined
				? getSelectValue(payload.view.state, 'post_channel_block', 'post_channel_select')
				: postChannelId
		)
	);
};

/**
 * Opens the create form. Groups and locations are read once here and carried in
 * private_metadata so the rebuilds below do not re-query on every keystroke.
 */
const openCreateEventModal = async (context: ActionContext) => {
	const { slackClient, payload, metadata } = context;

	const groups: Group[] = await GroupModel.find({}, 'group slug');
	const locations = await EventLocationModel.find({});

	const updatedMetadata: EventbotMetadata = {
		...metadata,
		groups,
		locations,
		showOtherGroupField: false,
		showOtherLocationFields: false,
		showAnnouncementFields: false
	};

	await pushModal(
		slackClient,
		payload.trigger_id,
		await createEventView(slackClient, updatedMetadata, null)
	);
};

/**
 * Routes one block action. Unknown action ids are ignored, which is what lets
 * the menu carry buttons that are not wired up yet.
 */
export const handleBlockAction = async (context: ActionContext) => {
	const { slackClient, payload, action, metadata } = context;

	switch (action.action_id) {
		case 'create_event':
			return openCreateEventModal(context);

		case 'group_select':
			return rebuildCreateEventModal(context, {
				showOtherGroupField: action.selected_option?.value === 'other-group'
			});

		case 'location_select':
			return rebuildCreateEventModal(context, {
				showOtherLocationFields: action.selected_option?.value === 'other-location'
			});

		case 'post_channel_select': {
			const selectedPostChannel: string | null = action.selected_option?.value ?? null;

			// the announcement message and the repost picker are only meaningful once
			// a post channel is chosen, so they stay hidden until then
			return rebuildCreateEventModal(
				context,
				{ showAnnouncementFields: Boolean(selectedPostChannel) },
				selectedPostChannel
			);
		}

		case 'cancel_event':
			return pushModal(slackClient, payload.trigger_id, await cancelEventView(metadata));

		case 'event_select':
			return updateModal(
				slackClient,
				payload.view,
				await cancelEventView(metadata, {
					selectedEventId: action.selected_option?.value ?? null
				})
			);

		case 'edit_event':
			// TODO: the menu button is wired up, the edit flow itself is not built yet
			return;

		default:
			return;
	}
};
