import { OrderItem } from "./Order.model";

export interface UserCreateOrderRequest {
    orderStateId: number,
    sellPointId: number,
    items: OrderItem[],
}