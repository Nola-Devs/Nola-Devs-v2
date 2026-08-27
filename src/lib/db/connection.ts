import mongoose, { connect } from 'mongoose';
import { MONGODB_URI, DB_NAME } from '$env/static/private';

// setting up the connection to the DB
const connectDB = async () => {
	if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
		return;
	}
	const dbUri = `${MONGODB_URI}${DB_NAME}`;

	try {
		await connect(dbUri);
		console.log('Database connected successfully');
	} catch (error) {
		console.warn('Database connection failed, continuing without DB:', error);
	}
};

export default connectDB;
