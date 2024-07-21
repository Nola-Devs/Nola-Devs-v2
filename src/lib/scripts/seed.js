import { connect } from 'mongoose';
const { MONGO_URL, DB_NAME } = process.env;
import { loadGroups } from './addGroups.js';
import { loadUsers } from './addUsers.js';
import { loadEvents } from './addEvents.js';

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

console.log('test');
try {
	await connectDB();
	await loadGroups();
	await loadUsers();
	await loadEvents();
	console.log('Data loaded successfully');
} catch (error) {
	console.error('Failed to load data:', error);
} finally {
	process.exit();
}
