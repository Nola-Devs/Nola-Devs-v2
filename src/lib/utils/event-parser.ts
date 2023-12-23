import type { Event } from "$types"


export const eventParser = (event: { summary: any; htmlLink: any; description: any; location: any; latLon: any; start: { dateTime: string | number | Date; date: string | number | Date }; end: { dateTime: string | number | Date; date: string | number | Date }; group: string }) => {
  return {
    group: event.group,
    summary: event.summary,
    calLink: event.htmlLink,
    description: event.description,
    location: event.location,
    lnglat: event.latLon,
    start: {
      date: event.start?.dateTime
        ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(event.start.dateTime))
        : new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(event.start.date)),
      time: event.start?.dateTime
        ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
          new Date(event.start.dateTime)
        )
        : undefined
    },
    end: {
      date: event.end?.dateTime
        ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(event.end.dateTime))
        : new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(event.end.date)),
      time: event.end?.dateTime
        ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
          new Date(event.end.dateTime)
        )
        : undefined
    }
  } as Event
}