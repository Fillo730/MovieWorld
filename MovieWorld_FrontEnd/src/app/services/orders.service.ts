import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { PagedResult } from '../models/PagedResult';
import { Order, OrderState } from '../models/Order.model';
import { OrdersFilter } from '../models/filters/OrdersFilter.model';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { UserCreateOrderRequest } from '../models/UserCreateOrderRequest.model';
import { RevenueYear } from '../models/stats/RevenueYear.model';
import { OrdersPerOrderState } from '../models/stats/OrdersPerOrderState.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = "https://localhost:7163/api/orders";

  constructor(private http: HttpClient) {}

  getOrders(pageIndex: number, pageSize: number, filters: OrdersFilter, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<PagedResult<Order>>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('lang', lang);

    if (filters) {
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.OrderStateId) params = params.set('orderStateId', filters.OrderStateId);
      if (filters.moviesNumber) params = params.set('moviesNumber', filters.moviesNumber.toString());
    }

    params = params.set('MaxTotalPrice', filters.totalValue[1]);
    params = params.set('MinTotalPrice', filters.totalValue[0]);

    return this.http.get<ApiResponse<PagedResult<Order>>>(this.apiUrl, { params });
  }

  addOrder(order: Order, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Order>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.post<ApiResponse<Order>>(this.apiUrl, order, { params });
  }

  deleteOrder(order: Order): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(this.apiUrl, { body: order });
  }

  updateOrder(order: Order, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Order>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${order.id}`, order, { params });
  }

  getOrderStates(lang: string = DEFAULT_LANGUAGE) : Observable<ApiResponse<OrderState[]>>{
    const params = new HttpParams().set('lang', lang);
    return this.http.get<ApiResponse<OrderState[]>>(`${this.apiUrl}/states`, { params });
  }

  getOrdersCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  getOrdersCompletedCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/countCompleted`);
  }

  getRevenueForEveryYear() : Observable<ApiResponse<RevenueYear[]>> {
    return this.http.get<ApiResponse<RevenueYear[]>>(`${this.apiUrl}/stats/revenueByYear`);
  }

  getOrdersCountPerOrderState(lang: string = DEFAULT_LANGUAGE) : Observable<ApiResponse<OrdersPerOrderState[]>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<ApiResponse<OrdersPerOrderState[]>>(`${this.apiUrl}/stats/ordersPerOrderState`, { params });
  }

  getUsersOrders(pageIndex: number, pageSize: number, filters: OrdersFilter, lang: string = DEFAULT_LANGUAGE, userId: number): Observable<ApiResponse<PagedResult<Order>>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('lang', lang)
      .set('userId', userId.toString());

    if (filters) {
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.OrderStateId) params = params.set('orderStateId', filters.OrderStateId.toString());
      if (filters.moviesNumber) params = params.set('moviesNumber', filters.moviesNumber.toString());
      
      if (filters.totalValue && filters.totalValue.length === 2) {
        params = params.set('MinTotalPrice', filters.totalValue[0].toString());
        params = params.set('MaxTotalPrice', filters.totalValue[1].toString());
      }
    }

    return this.http.get<ApiResponse<PagedResult<Order>>>(`${this.apiUrl}/user`, { params });
  }
}