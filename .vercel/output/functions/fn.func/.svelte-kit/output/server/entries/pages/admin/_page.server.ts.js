import { r as redirect } from "../../../chunks/index.js";
import { S as SessionModel, U as UserModel } from "../../../chunks/users.js";
import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
const load = async ({ cookies }) => {
  const browserSes = cookies.get("session");
  const dbSes = await SessionModel.findOne({ id: browserSes });
  const user = await UserModel.findById(dbSes?.user);
  if (Number(dbSes?.expire) >= Date.now() + 1e3 * 60 * 60 * 24 * 30) {
    await SessionModel.deleteOne({ id: browserSes });
  } else if (dbSes?.id === browserSes && dbSes && browserSes) {
    throw redirect(302, `/admin/${user?.role}`);
  } else {
    return { success: false };
  }
};
const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = await formData.get("email");
    const password = await formData.get("password");
    const permission = await formData.get("permissions");
    const userpw = await UserModel.findOne({ email, role: permission }).select([
      "password",
      "_id",
      "role"
    ]);
    if (userpw?.password) {
      const checkpw = await bcrypt.compare(password, userpw.password);
      if (checkpw) {
        const sessionId = randomBytes(32).toString("hex");
        const expire = 1e3 * 60 * 60 * 24 * 30;
        (await SessionModel.create({
          id: sessionId,
          expire: Date.now() + expire,
          user: userpw._id.toString()
        })).save();
        cookies.set("session", sessionId, {
          path: `/admin`,
          maxAge: expire
        });
        throw redirect(302, `/admin/${userpw.role}`);
      }
    }
    setTimeout(() => {
    }, 1e3);
    return { success: false };
  }
};
export {
  actions,
  load
};
