//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { filter, Observable } from 'rxjs';

//Models
import { ApiResponse } from '../models/ApiResponse.model';
import { PagedResult } from '../models/PagedResult';
import { Order, OrderState } from '../models/Order.model';
import { OrdersFilter } from '../models/filters/OrdersFilter.model';
import { RevenueYear } from '../models/stats/RevenueYear.model';
import { OrdersPerOrderState } from '../models/stats/OrdersPerOrderState.model';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("ORDERS");

  public getOrders(pageIndex: number, pageSize: number, filters: OrdersFilter): Observable<ApiResponse<PagedResult<Order>>> {
    let params = new HttpParams();

    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<Order>>>(this.apiUrl, { params });
  }

  public addOrder(order: Order): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, order);
  }

  public deleteOrder(order: Order): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(this.apiUrl, { body: order });
  }

  public updateOrder(order: Order): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${order.id}`, order);
  }

  public getOrderStates(): Observable<ApiResponse<OrderState[]>> {
    return this.http.get<ApiResponse<OrderState[]>>(`${this.apiUrl}/states`);
  }

  public getOrdersCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  public getOrdersCompletedCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/countCompleted`);
  }

  public getRevenueForEveryYear(): Observable<ApiResponse<RevenueYear[]>> {
    return this.http.get<ApiResponse<RevenueYear[]>>(`${this.apiUrl}/stats/revenueByYear`);
  }

  public getOrdersCountPerOrderState(): Observable<ApiResponse<OrdersPerOrderState[]>> {
    return this.http.get<ApiResponse<OrdersPerOrderState[]>>(`${this.apiUrl}/stats/ordersPerOrderState`);
  }

  public getUsersOrders(pageIndex: number, pageSize: number, filters: OrdersFilter): Observable<ApiResponse<PagedResult<Order>>> {
    let params = new HttpParams();
    
    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<Order>>>(`${this.apiUrl}/user`, { params });
  }

  private applyPagingParams(params : HttpParams, pageIndex : number, pageSize : number) {
    params = params.set('pageIndex', pageIndex.toString())
    params = params.set('pageSize', pageSize.toString())
    
    return params;
  }

  private applyFilters(params: HttpParams, filters?: OrdersFilter): HttpParams {
    if (filters) {
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.OrderStateId) params = params.set('orderStateId', filters.OrderStateId.toString());
      if (filters.moviesNumber) params = params.set('moviesNumber', filters.moviesNumber.toString());
      
      if (filters.totalValue && filters.totalValue.length === 2) {
        params = params.set('MinTotalPrice', filters.totalValue[0].toString());
        params = params.set('MaxTotalPrice', filters.totalValue[1].toString());
      }
    }

    return params;
  }
}