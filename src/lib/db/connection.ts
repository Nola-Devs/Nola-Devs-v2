import { connect } from 'mongoose';
import { MONGODB_URI, DB_NAME } from '$env/static/private';

// setting up the connection to the DB
const connectDB = async () => {
	const dbUri = `${MONGODB_URI}${DB_NAME}`;

	try {
		await connect(dbUri);
		console.log('Database connected successfully');
		console.log('Database connected successfully');
	} catch (error) {
		console.error('Database connection failed:', error);
		process.exit(1);
	}
};

export default connectDB;
