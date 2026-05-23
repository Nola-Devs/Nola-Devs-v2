import { error } from '@sveltejs/kit';
import GroupModel from '$lib/db/models/groups.model';
import type { UserRole } from '$lib/types/user';

interface ActingUser {
	role: UserRole;
	groupIds: string[];
}

/**
 * Returns the set of group slugs the user is permitted to organize.
 * Super admins get a wildcard (null). orgAdmins are scoped to groupIds.
 */
export async function getOrganizerScope(user: ActingUser): Promise<Set<string> | null> {
	if (user.role === 'super') return null;
	if (user.role !== 'orgAdmin') return new Set();
	if (!user.groupIds.length) return new Set();
	const groups = await GroupModel.find({ _id: { $in: user.groupIds } })
		.select(['slug'])
		.lean<{ slug: string }[]>();
	return new Set(groups.map((g) => g.slug));
}

export async function assertOrganizerForGroupSlug(
	user: ActingUser | null | undefined,
	groupSlug: string
): Promise<void> {
	if (!user) throw error(401, 'Sign in required');
	if (user.role === 'super') return;
	if (user.role !== 'orgAdmin') throw error(403, 'Organizer admin only');
	const scope = await getOrganizerScope(user);
	if (scope && !scope.has(groupSlug)) {
		throw error(403, 'Not an organizer for this group');
	}
}
