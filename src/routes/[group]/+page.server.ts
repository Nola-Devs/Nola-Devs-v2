import type { PageServerLoad } from './$types';

import { findGroupByName, type Group } from '$data';
import type { Event, PageServerLoadResult } from '../../app';
import { Sanitizer } from '$lib';

import { CAL } from '$env/static/private'

export const load: PageServerLoad = async ({ params }): Promise<PageServerLoadResult> => {

  const group: string = params.group.split('=')[1] as string;
  const groupObj: Group = findGroupByName(group) as Group;
  const calID: string = groupObj.calID;

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 90);

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calID}/events?timeMin=${start.toISOString()}&key=${CAL}`, { method: "GET" });

  const eventsJSON = (await res.json()).items

  const events: Event[] = eventsJSON !== undefined ? 
  eventsJSON
    .map((e: any) => ({
      summary: e.summary,
      calLink: e.htmlLink,
      description: Sanitizer(e.description),
      location: e.location,
      start: e.start.dateTime,
      end: e.end.dateTime,
    }))
    .sort((a:Event ,b:Event)=> 
      new Date(a.start).getTime() - new Date(b.start).getTime()) : [];

  return {
    groupObj,
    events,
  };

};