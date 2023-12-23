// import type { Event } from '$types'
// import { CAL } from '$env/static/private';
// import { GroupModel } from '$lib/db/groups';
// import { revGeocode } from './rev-geocode';
// import type { LngLat } from 'mapbox-gl';


// interface EventsGroups {
//   group: string;
//   events: Event[];
// }
// interface CalIDGroups {
//   group: string;
//   calID: string;
// }

// /*
//   This is the default calendar for the one off turn this into a pvt key
//  545d217a064ce6f846e820045fccdaae17db65ee1b53dc14ea249833b94d0f70@group.calendar.google.com
// */


// export const updateEvents = (cals: CalIDGroups[]) => {
//   const start = new Date();
//   const end = new Date();
//   // This is the amount of days from today for API
//   const days = 30;
//   end.setTime(end.getTime() + days * 86400000);

//   const promisesArray = cals.map(async (cal: CalIDGroups) => {
//     const data = await (
//       await fetch(
//         `https://www.googleapis.com/calendar/v3/calendars/${cal.calID
//         }/events?timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&singleEvents=true&showDeleted=false&orderBy=startTime&key=${CAL}`,
//         { method: 'GET' }
//       )
//     ).json().catch(e => console.log(e))
//     // TODO: Add a geocoding Key here in the events OBJ for less API calls on run time
//     const events: Event[] = data.items.map((e: any) => {
//       const lnglat = revGeocode(e.location)
//       const event: Event = {
//         group: cal.group,
//         summary: e.summary,
//         calLink: e.htmlLink,
//         description: e.description,
//         location: e.location,
//         lnglat: {
//           lng: lnglat.lng, lat: lnglat.lat,
//         },
//         start: {
//           date: e.start?.dateTime
//             ? new Intl.DateTimeFormat('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric'
//             }).format(new Date(e.start.dateTime))
//             : new Intl.DateTimeFormat('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric'
//             }).format(new Date(e.start.date)),
//           time: e.start?.dateTime
//             ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
//               new Date(e.start.dateTime)
//             )
//             : undefined
//         },
//         end: {
//           date: e.end?.dateTime
//             ? new Intl.DateTimeFormat('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric'
//             }).format(new Date(e.end.dateTime))
//             : new Intl.DateTimeFormat('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric'
//             }).format(new Date(e.end.date)),
//           time: e.end?.dateTime
//             ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
//               new Date(e.end.dateTime)
//             )
//             : undefined
//         }
//       }
//       return event
//     }) as Event[];
    
//     //await GroupModel.findOneAndUpdate({ group: cal.group }, { events })


//     return {
//       events
//     }
//   });
//   return Promise.all(promisesArray);
// };