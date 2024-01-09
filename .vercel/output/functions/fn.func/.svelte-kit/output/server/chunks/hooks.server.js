import { connect } from "mongoose";
import { M as MONGO_URL, D as DB_NAME } from "./private.js";
const start_db = async () => {
  return await connect(MONGO_URL + DB_NAME + DB_NAME).then(() => console.log("connected"));
};
start_db().then(() => console.log("DB Started")).catch((e) => console.log(e));
