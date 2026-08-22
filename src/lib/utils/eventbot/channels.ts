/**
 * Channel lookups for the eventbot modals.
 *
 * Only channels the bot has been invited to are offered, so an announcement can
 * never fail with `not_in_channel`. Requires the `channels:read` and
 * `groups:read` scopes from slackbot-config.json.
 */

import type { WebClient } from '@slack/web-api';
import { AUDIT_LOG_CHANNEL_NAME } from '$lib/utils/eventbot/audit';

// slack caps static_select at 100 options
const MAX_CHANNEL_OPTIONS = 100;

export type ChannelOption = { text: string; value: string };

export type BotChannels = {
	options: ChannelOption[];
};

export const listBotChannels = async (slackClient: WebClient): Promise<BotChannels> => {
	const channels: Array<{ id?: string; name?: string }> = [];
	let cursor: string | undefined;

	try {
		do {
			const result = await slackClient.users.conversations({
				types: 'public_channel,private_channel',
				exclude_archived: true,
				limit: 200,
				cursor
			});

			channels.push(...(result.channels ?? []));
			cursor = result.response_metadata?.next_cursor || undefined;
		} while (cursor);
	} catch (err) {
		// the create form still opens, it just cannot offer anywhere to announce
		console.error('Failed to list eventbot channels:', err);
		return { options: [] };
	}

	const options = channels
		// the audit channel already gets a full record of the event, an
		// announcement on top of that is just noise
		.filter((channel) => channel.id && channel.name && channel.name !== AUDIT_LOG_CHANNEL_NAME)
		.sort((a, b) => String(a.name).localeCompare(String(b.name)))
		.slice(0, MAX_CHANNEL_OPTIONS)
		.map((channel) => ({ text: `#${channel.name}`, value: String(channel.id) }));

	return { options };
};
