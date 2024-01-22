import groups from './data/groups.json' assert {type: 'json'};
import { model, Schema } from 'mongoose';


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

const EventModel = model('Event', eventSchema);

export const loadEvents = async () => {
  const res = await EventModel.bulkSave(groups.map(e => new EventModel(e)))
  console.log(res)
}