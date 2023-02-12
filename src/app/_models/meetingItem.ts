export interface PersonResponsible {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateCreated: Date;
    emailAddress: string;
}

export interface MeetingItem {
    id: number;
    personResponsible: PersonResponsible;
    action: string;
    meetingItemStatus: MeetingItemStatus;
    addedDate: Date;
    dueDate: Date;
    dateUpdated: Date;
}

export interface MeetingItemStatus {
    id: number;
    status: string;
    addedDate: Date;
    lastUpdatedDate: Date;
}
