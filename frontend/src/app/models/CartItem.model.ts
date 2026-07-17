import { Movie } from "./Movie.model";

export interface CartItem {
    movie : Movie,
    quantity : number;
}