import { G as GroupModel } from "../../../chunks/groups.js";
const load = async () => {
  const events = await GroupModel.distinct("events");
  const removeHN = events.filter((event) => event.summary !== "Hack Night ").sort(
    (a, b) => new Date(a.start.date).getTime() - new Date(b.start.date).getTime()
  );
  return {
    events: removeHN
  };
};
export {
  load
};
