import { G as GroupModel } from "../../../chunks/groups.js";
const load = async () => {
  const groups = await GroupModel.distinct("group");
  return {
    groups
  };
};
export {
  load
};
