import type { Event } from '$types';


// Function to parse Google Calendar event data
export const eventParser = (eventData: any): Event => {
  const {
    group,
    summary,
    htmlLink: calLink,
    description,
    location,
    latLon: lnglat,
    start,
    end,
  } = eventData;

  // Function to format date using Intl.DateTimeFormat
  const formatDate = (dateString: string ) =>
       new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(dateString))

  // Function to format time using Intl.DateTimeFormat
  const formatTime = (dateTimeString: string | undefined) =>
    dateTimeString
      ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
          new Date(dateTimeString)
        )
      : undefined;

  // Parse and structure event data
  const parsedEvent: Event = {
    group,
    summary,
    calLink,
    description,
    location,
    lnglat,
    dateTime: new Date(start?.dateTime),
    start: {
      date: formatDate(start?.dateTime || start?.date),
      time: formatTime(start?.dateTime),
    },
    end: {
      date: formatDate(end?.dateTime || end?.date),
      time: formatTime(end?.dateTime),
    },
  };

  return parsedEvent;
};
