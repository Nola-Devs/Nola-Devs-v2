import type { Event } from '$types';



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

  
  const formatDate = (dateString: string ) =>
       new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(dateString))

  
  const formatTime = (dateTimeString: string | undefined) =>
    dateTimeString
      ? new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
          new Date(dateTimeString)
        )
      : undefined;

  
  const parsedEvent: Event = {
	group: group || '',
    summary: summary || '',
    calLink: calLink || '',
    description: description || '',
    location: location || '',
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
