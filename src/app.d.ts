// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface Event {
  summary: string;
  calLink: string;
  description: string;
  location: string;
  start: {
    date:string
    time:string
  };
  end: {
    date:string
    time:string
  };
}

interface PageServerLoadResult {
  groupObj: Group;
  events: Event[];
}
type linkKey = "linkedin" | "facebook" | "twitter" | "github" | "twitch" | "eventbrite" | "meetup" | "youtube" | "linktr" | "email" | "website" | string

type Link ={[key: linkKey]: string}

type Organizers = {
  name:string,
  pfp:string,
  links: Link
}

interface Group {
	group: string,
	about: string,
	calID: string,
	orgLinks: Link,
	organizers: Organizers[]
}


export { Event, Group, Organizers, PageServerLoadResult };
