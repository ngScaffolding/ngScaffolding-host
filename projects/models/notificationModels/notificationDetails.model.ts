export const enum NotificationTypes {
    Email,
    Socket,
    Push
}

export class NotifcationDetails {
    name: string;
    message: string;
    triggerDataSourceName: string;
    types: NotificationTypes[];

    // Payload
    data: object;

    // Url etc
    target: string;
}
