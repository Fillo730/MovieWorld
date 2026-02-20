import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models/Cart.model';
import { Movie } from '../models/Movie.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { UserCreateOrderRequest } from '../models/UserCreateOrderRequest.model';
import { Order } from '../models/Order.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = 'https://localhost:7163/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  refreshCart(lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Cart>> {
    const params = new HttpParams().set('lang', lang);
    
    return this.http.get<ApiResponse<Cart>>(this.apiUrl, { params }).pipe(
      tap((response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      })
    );
  }

  addToCart(movie: Movie, quantity: number = 1, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Cart>> {
    const params = new HttpParams().set('lang', lang);
    const body = { movieId: movie.movieId, quantity };

    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/add`, body, { params }).pipe(
      tap((response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      })
    );
  }

  removeFromCart(movieId: number, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Cart>> {
    const params = new HttpParams().set('lang', lang);

    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/remove/${movieId}`, { params }).pipe(
      tap((response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      })
    );
  }

  clearCart(lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Cart>> {
    const params = new HttpParams().set('lang', lang);

    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/clear`, { params }).pipe(
      tap((response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      })
    );
  }

  addUserOrder(request : UserCreateOrderRequest ,lang : string = DEFAULT_LANGUAGE) : Observable<ApiResponse<Order>> {
    const params = new HttpParams().set('lang',lang);
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/order`, request, { params });
  }

  getMovieIds() : number[] {
    const cart = this.cartSubject.value;
    return cart?.items?.map(item => item.movie.movieId) ?? [];
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value?.items ?? [];
  }

  isEmpty(): boolean {
    return !this.cartSubject.value || (this.cartSubject.value.items?.length ?? 0) === 0;
  }

  getNumberOfItems(): number {
    return this.cartSubject.value?.items?.length ?? 0;
  }

  getTotal(): number {
    return this.cartSubject.value?.totalPrice ?? 0;
  }

  isInTheCart(movieId: number): boolean {
    return this.cartSubject.value?.items?.some(item => item.movie.movieId === movieId) ?? false;
  }

  getQuantityForMovie(movieId: number): number {
    return this.cartSubject.value?.items?.find(item => item.movie.movieId === movieId)?.quantity ?? 0;
  }

  clearLocalCart(): void {
    this.cartSubject.next(null);
  }
}