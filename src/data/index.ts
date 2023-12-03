// place files you want to import through the `$data` alias in this folder.
import type { Group } from '../app';
import GroupsData from './groups.json';

const GroupNames: string[] = GroupsData.map((group: any) => group.group).filter(Boolean);

interface eventsList {
	name: string;
	id: string;
}

const CalList: eventsList[] = GroupsData.map((group: any) => ({
	id: group.calID,
	name: group.group || 'single-events'
})).filter((e) => e.id);

const findGroupByName = (targetGroup: string): Group => {
	const groups = GroupsData as unknown as Group[];
	return (
		groups.find((group: Group) => group.group === targetGroup) ||
		(GroupsData[0] as unknown as Group)
	);
};

export { Group, CalList, GroupNames, findGroupByName };
