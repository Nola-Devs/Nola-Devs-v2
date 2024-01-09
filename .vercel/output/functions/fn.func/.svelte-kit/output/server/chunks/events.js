import { Schema, model } from "mongoose";
const eventSchema = new Schema({
  group: String,
  summary: String,
  calLink: String,
  description: String,
  location: String,
  lnglat: [Number, Number],
  start: {
    date: String,
    time: String
  },
  end: {
    date: String,
    time: String
  }
});
const EventModel = model("Event", eventSchema);
export {
  EventModel as E
};
