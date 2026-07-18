import { User } from "./User.model";
import { SellPoint } from "./SellPoint.model";
import { Movie } from "./Movie.model";

export interface OrderState {
  id: number,
  name: string
}

export interface OrderItem {
  movie: Movie;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  date: Date;
  state: OrderState;
  user: User;
  sellPoint: SellPoint;
  totalAmount: number;
  couponCode: string | null;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
}