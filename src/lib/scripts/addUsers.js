import groups from './data/users.json' assert {type: 'json'};
import { model, Schema } from 'mongoose';


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

export const UserModel = model('User', UserSchema);

export const loadUsers = async () => {
  const res = await UserModel.bulkSave(groups.map(e => new UserModel(e)))
  console.log(res)
}