import { connect } from 'mongoose';
import { MONGO_URL, DB_NAME } from '$env/static/private';

// setting up the connection to the DB
const connectDB = async () => {
	const dbUri = `${MONGO_URL}${DB_NAME}`;

	try {
		await connect(dbUri);
		console.log('Database connected successfully');
	} catch (error) {
		console.error('Database connection failed:', error);
		process.exit(1);
	}
};

export default connectDB;
