export const getGroupsEvents = async () => {
	try {
		let eventsJSON = await (await fetch('data/events.json')).json();
		let groupsJSON = await (await fetch('data/groups.json')).json();
		return {
			groupsJSON,
			eventsJSON
		};
	} catch (error) {
		throw new Error("Counldn't Find Group :" + error);
	}
};
