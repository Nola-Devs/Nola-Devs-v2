import connectDB from '$lib/db/db';

import { loadGroups } from './addGroups.js';
import { loadEvents } from './addEvents.js';
import { loadUsers } from './addUsers.js';

// setting up the connection to the DB
const runSeedScripts = async () => {
	await connectDB(); // Use the centralized connection function
	try {
		await loadGroups();
		await loadEvents();
		await loadUsers();
		console.log('Data loaded successfully');
	} catch (error) {
		console.error('Failed to load data:', error);
	} finally {
		process.exit(); // Ensure to disconnect or exit the process
	}
};

runSeedScripts();
