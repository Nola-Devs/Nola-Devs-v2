import { createEvent, DateArray} from 'ics';
import type { Event } from '$lib/types/event.d.ts'

export const ics  = (event : Event) => {

    if(window.confirm("Do you wish to continue download?"))
        downloadICS(event)
	
};

async function downloadICS(event :Event){
    const { summary, description, start, end, location, lnglat, group, calLink } = event;
    const startDate : DateArray = convertToDateTimeArray(start);
    const endDate : DateArray = convertToDateTimeArray(end);
    const geo = {lat:lnglat[0],lon:lnglat[1]};
    let filename = summary + '.ics'

    const icsEvent = {
    	start: startDate,
    	end: endDate,
        title: summary,
    	description: description,
    	location: location,
        geo:geo
    }

   
    let file : File;
   

      file = await new Promise((resolve, reject) => {
        createEvent(icsEvent
        ,(error, value) => {
            if (error) {
            reject(error)
            }
            resolve(new File([value], filename, { type: 'text/calendar' }))
        })
    })

    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
   
    URL.revokeObjectURL(url);

    
    }

    function convertToDateTimeArray(date : Date){
        const year = date.getFullYear();
        const day = date.getDay();
        const month = date.getMonth();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const convertDateToArray : DateArray = [year,day,month,hours,minutes];

        return convertDateToArray;
    }


