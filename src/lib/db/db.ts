import { connect } from 'mongoose';
import { MONGO_URL, DB_NAME } from '$env/static/private';

// setting up the connection to the DB
export const start_db = async () => {
	return await connect(MONGO_URL + DB_NAME).then(() => console.log('connected'));
};
