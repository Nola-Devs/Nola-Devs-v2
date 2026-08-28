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

export const CREATE_EVENT_CALLBACK_ID = 'create_event_modal';
export const CANCEL_EVENT_CALLBACK_ID = 'cancel_event_modal';

// slack caps static_select at 100 options
const MAX_CANCELLABLE_EVENTS = 100;

/**
 * What is carried between interactions in `private_metadata`: just who opened the
 * menu. Which fields the form reveals is derived from the form's own state, and
 * the data behind those fields is re-fetched, since slack caps this field at
 * 3000 characters.
 */
export type EventbotMetadata = {
	user_id?: string;
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
 * The create form. Which fields are revealed is read back out of the form's own
 * state rather than tracked in metadata, so a rebuild always renders what the
 * form currently holds and two fast changes cannot lose one another.
 */
export const createEventView = async (
	slackClient: WebClient,
	metadata: EventbotMetadata,
	// the view state slack sends with every interaction, absent on first open
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	state?: any
) => {
	// re-fetched on every rebuild rather than stashed, private_metadata caps at 3000 chars
	const [groups, locations, { options: channels }] = await Promise.all([
		GroupModel.find({}, 'group slug'),
		EventLocationModel.find({}, 'name slug'),
		listBotChannels(slackClient)
	]);

	const postChannelId = getSelectValue(state, 'post_channel_block', 'post_channel_select');

	return modalView({
		callbackId: CREATE_EVENT_CALLBACK_ID,
		title: 'Create an Event',
		submit: 'Submit',
		close: 'Cancel',
		metadata,
		blocks: buildCreateEventModalBlocks({
			groups: createGroupOptions(groups),
			locations: createLocationOptions(locations),
			channels,
			postChannelId,
			showOtherGroupField:
				getSelectValue(state, 'group_section_block', 'group_select') === 'other-group',
			showOtherLocationFields:
				getSelectValue(state, 'location_section_block', 'location_select') === 'other-location',
			// the announcement message and the repost picker are only meaningful once
			// a post channel is chosen, so they stay hidden until then
			showAnnouncementFields: Boolean(postChannelId)
		})
	});
};

/**
 * The cancel form. The event list is always read fresh, since an event can be
 * cancelled elsewhere or age off the site while the modal sits open.
 */
export const cancelEventView = async (
	metadata: EventbotMetadata,
	options: { selectedEventId?: string | null; isMissingField?: boolean } = {}
) => {
	const { selectedEventId = null, isMissingField = false } = options;

	// anything the site still shows should be cancellable, or an organizer is told
	// an event they can see does not exist. the site lists everything until mongo's
	// ttl index drops it at expireAt, so that is the same line to draw here — which
	// does mean an event that is over but still posted can be taken down.
	// expireAt is not required by the schema, and an event without one never leaves
	// the site at all, so those have to be offered too
	const cancellableEvents = await EventModel.find({
		$or: [{ expireAt: { $gte: new Date() } }, { expireAt: { $exists: false } }]
	})
		.sort({ start: 1 })
		.limit(MAX_CANCELLABLE_EVENTS);

	const events = createEventOptions(cancellableEvents);

	// the cleanup checkbox is only worth showing once we know the chosen event
	// actually has posts behind it
	const selectedEvent = cancellableEvents.find(
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
const updateModal = async (
	slackClient: WebClient,
	view: { id: string; hash?: string },
	updated: ModalView
) => {
	await slackClient.views.update({ view_id: view.id, hash: view.hash, view: updated });
};

/**
 * Stacks a modal on top of the one the interaction came from.
 */
const pushModal = async (slackClient: WebClient, triggerId: string, view: ModalView) => {
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
 * Routes one block action. Unknown action ids are ignored, which is what lets
 * the menu carry buttons that are not wired up yet.
 */
export const handleBlockAction = async (context: ActionContext) => {
	const { slackClient, payload, action, metadata } = context;

	switch (action.action_id) {
		case 'create_event':
			return pushModal(
				slackClient,
				payload.trigger_id,
				await createEventView(slackClient, metadata)
			);

		// each of these reveals or hides fields, so the form is re-rendered from the
		// state slack sent along with the action
		case 'group_select':
		case 'location_select':
		case 'post_channel_select':
			return updateModal(
				slackClient,
				payload.view,
				await createEventView(slackClient, metadata, payload.view.state)
			);

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
