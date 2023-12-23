import { CAL } from '$env/static/private'


export const googleCalAPICall = async (calID: string) => {

  // This is the amount of days from today for API
  const days = 30;
  
  const start = new Date();
  const end = new Date();
  end.setTime(end.getTime() + days * 86400000);

  const timeFrame = `timeMax=${end.toISOString()}&timeMin=${start.toISOString()}`
  const auth = `key=${CAL}`
  const queryParams = `singleEvents=true&showDeleted=false&orderBy=startTime`

  const reqToGoogle = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calID
    }/events?${timeFrame}&${queryParams}&${auth}`,
    { method: 'GET' }
  )

  const parseReqToJson = await reqToGoogle.json()
  
  return parseReqToJson
}