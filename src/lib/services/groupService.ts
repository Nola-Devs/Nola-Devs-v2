
import GroupModel from '$lib/db/groups';
import type { Event } from '$lib/types/event.d.ts';
import type { Group } from '$lib/types/group';
import { eventService } from './eventService';

export class groupService  {

    async getGroup( slug: string ) : Promise<Group> {
       
		const group: Group | null = await GroupModel.findOne({ slug }).select('-_id -__v').lean();

		if (!group) {
			throw new Error('Group not found');
		}
        return group;
    }

    // Fetch related events via event service using group's slug
    async getEventsByGroup(params : any) {
       
        const { slug } = params;
      
        try {
            const group: Group | null = await this.getGroup(slug);
            const events : Event[] =  await new eventService().getEventsByGroup(slug);

		    return { group, events };
        } catch (error) {
            console.error('Failed to fetch group and events:', error);
            return {
                status: 404,
                error: new Error('Group or events not found')
            };
        };
    }
}


