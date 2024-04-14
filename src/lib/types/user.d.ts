type userLinkKey = 'website' | 'github' | 'linkedin' | 'twitter';

type userLinks = {
	link: string | null | undefined; [key: userLinkKey]: string 
};

export interface User {
	name: string;
	pfp: string;
	links: userLinks;
	email: string;
	password: string;
	role: string;
	group: string;
}
