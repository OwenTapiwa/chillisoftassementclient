



export interface MeetingType {
    id: number;
    name: string;
    dateAdded: Date;
    preFix: string;
}

export interface MinutesTaker {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateCreated: Date;
    emailAddress: string;
    accessFailedCount: number;
    dateLastLoggedIn: Date;
    userRoles?: any;
    lockedOut: boolean;
    isDeleted: boolean;
    dateDeleted: Date;
    deletedBy?: any;
    id: number;
    userName: string;
    normalizedUserName: string;
    email?: any;
    normalizedEmail?: any;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd?: any;
    lockoutEnabled: boolean;
}

export interface Meeting {
    id: number;
    meetingId: string;
    meetingType: MeetingType;
    dateHeld: Date;
    meetingItem?: any;
    minutesTaker: MinutesTaker;
}






