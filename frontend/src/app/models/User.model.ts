export interface User {
    userId: number;
    email: string;
    name: string;
    surname: string;
    imagePath: string;
    role: number;
    createdAt?: string;
    preferredSellPointId?: number | null;
    emailNotificationsEnabled: boolean;
}