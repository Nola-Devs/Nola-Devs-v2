import { S as SessionModel, U as UserModel } from "../../../../chunks/users.js";
import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ cookies }) => {
  const browserSes = cookies.get("session");
  const dbSes = await SessionModel.findOne({ id: browserSes });
  const user = await UserModel.findById(dbSes?.user);
  console.log("test");
  if (Number(dbSes?.expire) > Date.now() + 1e3 * 60 * 60 * 24 * 30) {
    await SessionModel.deleteOne({ id: browserSes });
  }
  if (dbSes?.id !== browserSes || !browserSes || user?.role !== "admin") {
    throw redirect(302, `/admin`);
  }
};
export {
  load
};
