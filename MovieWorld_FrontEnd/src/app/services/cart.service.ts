//Angular
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//rxjs
import { Observable, tap } from 'rxjs';

//Models
import { Cart, CartItem } from '../models/Cart.model';
import { Movie } from '../models/Movie.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { UserCreateOrderRequest } from '../models/UserCreateOrderRequest.model';
import { Order } from '../models/Order.model';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("CART");

  private readonly _cart = signal<Cart | null>(null);

  public readonly cart = this._cart.asReadonly();
  
  public readonly itemsCount = computed(() => this._cart()?.items?.length ?? 0);
  
  public readonly totalPrice = computed(() => this._cart()?.totalPrice ?? 0);
  
  public readonly isEmpty = computed(() => (this._cart()?.items?.length ?? 0) === 0);

  public refreshCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
        }
      })
    );
  }

  public addToCart(movie: Movie, quantity: number = 1): Observable<ApiResponse<Cart>> {
    const body = { movieId: movie.movieId, quantity };
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/add`, body).pipe(
      tap((response) => {
        if (response.success) this._cart.set(response.data);
      })
    );
  }

  public removeFromCart(movieId: number): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/remove/${movieId}`).pipe(
      tap((response) => {
        if (response.success) this._cart.set(response.data);
      })
    );
  }

  public clearCart(): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/clear`).pipe(
      tap((response) => {
        if (response.success) this._cart.set(response.data);
      })
    );
  }

  public addUserOrder(request: UserCreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/order`, request);
  }

  public isInTheCart(movieId: number): boolean {
    return this._cart()?.items?.some(item => item.movie.movieId === movieId) ?? false;
  }

  public getQuantityForMovie(movieId: number): number {
    return this._cart()?.items?.find(item => item.movie.movieId === movieId)?.quantity ?? 0;
  }

  public clearLocalCart(): void {
    this._cart.set(null);
  }
}