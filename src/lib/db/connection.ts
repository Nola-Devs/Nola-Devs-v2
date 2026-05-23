import mongoose, { connect } from 'mongoose';
import { MONGODB_URI, DB_NAME } from '$env/static/private';

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
	if (mongoose.connection.readyState === 1) return;
	if (!connectionPromise) {
		const dbUri = `${MONGODB_URI}${DB_NAME}`;
		connectionPromise = connect(dbUri).catch((err) => {
			// Reset so the next request can retry instead of being permanently
			// poisoned by a single transient failure (DNS, cold-start race).
			connectionPromise = null;
			console.error('Database connection failed:', err);
			throw err;
		});
	}
	await connectionPromise;
};

export default connectDB;
