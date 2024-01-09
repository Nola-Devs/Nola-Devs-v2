import { Schema, model } from "mongoose";
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
export {
  SessionModel as S,
  UserModel as U
};
