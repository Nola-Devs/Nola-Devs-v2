/**
 * This file contains helpers for the Slack Eventbot which is used for
 * adding events to noladevs.org from the Nola devs community Slack.
 */

import type { Group } from '$lib/types/group';

export const createGroupOptions = (fetchedGroups: Group[]) => {
	return fetchedGroups.map((fetchedGroup: Group) => {
		return {
			text: {
				type: 'plain_text' as const,
				text: fetchedGroup.group,
				emoji: true
			},
			value: fetchedGroup.slug
		};
	});
};

/**
 * This is used for building the blocks in the
 * Create Event modal flow. Reactivity happens with
 * the Group select and the Location select when an
 * 'Other' option is selected.
 */
export const buildCreateEventModalBlocks = () => {};
