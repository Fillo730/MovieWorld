import { Movie } from "./Movie.model";

export interface CartItem {
    movie : Movie;
    quantity : number;
}

export interface Cart {
    cartId: number;
    items: CartItem[];
    totalPrice?: number;
}