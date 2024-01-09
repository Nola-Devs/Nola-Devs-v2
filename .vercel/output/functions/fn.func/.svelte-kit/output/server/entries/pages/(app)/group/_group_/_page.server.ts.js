import { G as GroupModel } from "../../../../../chunks/groups.js";
import { E as EventModel } from "../../../../../chunks/events.js";
const load = async ({ params }) => {
  const slug = params.group.replace(/-/g, " ");
  const group = await GroupModel.findOne({ group: slug }).select(["-_id", "-__v"]).lean();
  const events = await EventModel.find({ group: slug }).select(["-_id", "-__v"]).lean();
  return {
    group,
    events
  };
};
export {
  load
};
