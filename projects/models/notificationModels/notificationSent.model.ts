import { NotificationTypes } from './notificationDetails.model';

export class NotificationSentMessage {
    notificationDetailsName: string;
    userId: string;
    type: NotificationTypes;

    dateSent: Date;
    dateRead: Date;

    expires: Date;

    // Payload
    data: object;

    // Url etc
    target: string;
}
