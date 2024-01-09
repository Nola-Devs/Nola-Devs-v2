import { Schema, model } from "mongoose";
import { r as redirect } from "../../../../chunks/index.js";
const SessionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  expire: {
    type: Date,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});
const SessionModel = model("Session", SessionSchema);
const UserSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  pfp: {
    type: String,
    required: false
  },
  links: {
    type: Object,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: false
  }
});
const UserModel = model("User", UserSchema);
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
