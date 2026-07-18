export interface AppNotification {
    notificationId: number;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}
