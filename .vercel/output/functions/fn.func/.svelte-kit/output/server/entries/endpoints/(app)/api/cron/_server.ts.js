import { C as CAL, a as CRON_SECRET } from "../../../../../chunks/private.js";
import { G as GroupModel } from "../../../../../chunks/groups.js";
import { E as EventModel } from "../../../../../chunks/events.js";
const googleCalAPICall = async (calID) => {
  const days = 30;
  const start = /* @__PURE__ */ new Date();
  const end = /* @__PURE__ */ new Date();
  end.setTime(end.getTime() + days * 864e5);
  const timeFrame = `timeMax=${end.toISOString()}&timeMin=${start.toISOString()}`;
  const auth = `key=${CAL}`;
  const queryParams = `singleEvents=true&showDeleted=false&orderBy=startTime`;
  const reqToGoogle = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calID}/events?${timeFrame}&${queryParams}&${auth}`,
    { method: "GET" }
  );
  const parseReqToJson = await reqToGoogle.json();
  return parseReqToJson;
};
const PUBLIC_MAPBOX = "pk.eyJ1IjoiZXRhbmhleSIsImEiOiJjbHI1a3loODIxem1yMmtxbTd4NHFtemVvIn0.0rdAFelIQPZRUclgOsNTsg";
const revGeocode = async (address) => {
  const businessAndAddressRegex = /\b\d+\s+[a-zA-Z0-9\s.,-]+,\s*[a-zA-Z\s]+\s*,\s*[a-zA-Z]+\s*\d{5}(?:-\d{4})?\s*,\s*[a-zA-Z]+\b/;
  const parsedAddress = address.match(businessAndAddressRegex);
  const locationURL = (address2, type) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${address2}.json?types=${type}&access_token=${PUBLIC_MAPBOX}`;
  if (parsedAddress !== null) {
    let req = await (await fetch(locationURL(parsedAddress, "address"), { method: "GET" })).json();
    return req.features[0].center;
  } else if (!address.match(/^http/)) {
    let req = await (await fetch(locationURL(address, "poi"), { method: "GET" })).json();
    if (req.features[0].center[0] !== -90.071533) {
      return req.features[0].center;
    }
  }
  return [-90.071533, 29.951065];
};
const eventParser = (event) => {
  return {
    group: event.group,
    summary: event.summary,
    calLink: event.htmlLink,
    description: event.description,
    location: event.location,
    lnglat: event.latLon,
    start: {
      date: event.start?.dateTime ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(event.start.dateTime)) : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(event.start.date)),
      time: event.start?.dateTime ? new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(
        new Date(event.start.dateTime)
      ) : void 0
    },
    end: {
      date: event.end?.dateTime ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(event.end.dateTime)) : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(event.end.date)),
      time: event.end?.dateTime ? new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(
        new Date(event.end.dateTime)
      ) : void 0
    }
  };
};
const GET = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("You Shall Not Pass!", { status: 401 });
  }
  const calList = await GroupModel.find({}).select(["group", "calID"]);
  const events = (await Promise.all(
    Object.values(calList).map((e) => e.calID).map(googleCalAPICall)
  )).map(
    (eventsObj, i) => eventsObj.items.map((event) => ({ ...event, group: calList[i].group }))
  ).flat();
  const eventsWithLatLon = (await Promise.all(
    Object.values(events).map((e) => e.location).map(revGeocode)
  )).map((e, i) => ({ ...events[i], latLon: e }));
  const parseEvents = eventsWithLatLon.map((e) => eventParser(e));
  EventModel.collection.drop();
  EventModel.bulkSave(parseEvents.map((e) => new EventModel(e)));
  return new Response(JSON.stringify(events), { status: 200 });
};
export {
  GET
};
