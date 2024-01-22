import { connect } from "mongoose";

import { loadGroups } from "./addGroups.js";
import { loadEvents } from "./addEvents.js";
import { loadUsers } from "./addUsers.js";

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME



// setting up the connection to the DB
export const start_db = async () => {
  // @ts-ignore
  return await connect(MONGO_URL + DB_NAME).then(() => console.log('connected'));

};
start_db()
  .then(() => {
    loadGroups()
    loadEvents()
    loadUsers()
    return
  })
  .catch(console.error); 