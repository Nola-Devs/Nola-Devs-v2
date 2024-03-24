export interface Event {
    group: string;
    summary: string;
    calLink: string;
    description: string;
    location: string;
    lnglat: [number, number];
    start: Date;
    end: Date;
    eventSlug?: string;
    groupSlug?: string;
}