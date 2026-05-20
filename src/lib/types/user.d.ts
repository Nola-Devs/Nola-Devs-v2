export type UserRole = 'super' | 'orgAdmin' | 'member';

export type UserLinkKey = 'website' | 'github' | 'linkedin' | 'twitter';

export type UserLinks = {
	link?: string | null;
	[key: UserLinkKey]: string | undefined | null;
};

export interface User {
	githubId?: number;
	email: string;
	name?: string;
	avatarUrl?: string;
	role: UserRole;
	groupIds: string[];
	createdAt: Date;

	pfp?: string;
	links?: UserLinks;
	group?: string;
}
