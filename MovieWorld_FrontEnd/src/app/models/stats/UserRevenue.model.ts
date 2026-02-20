import { User } from "../User.model";

export interface UserRevenue {
    user: User;
    revenue: number;
}