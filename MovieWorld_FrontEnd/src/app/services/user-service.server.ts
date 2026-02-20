import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { User } from '../models/User.model';
import { PagedResult } from '../models/PagedResult';
import { UsersFilter } from '../models/filters/UsersFilter.model';
import { UserYear } from '../models/stats/UserYear.model';
import { UserRevenue } from '../models/stats/UserRevenue.model';
import { UserMonth } from '../models/stats/UserMonth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = "https://localhost:7163/api/users";

  constructor(private http: HttpClient) {}

  getUsers(
    pageIndex: number = 0, 
    pageSize: number = 10, 
    filters?: UsersFilter
  ): Observable<ApiResponse<PagedResult<User>>> {
    
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.query) params = params.set('query', filters.query);
      if (filters.role !== undefined && filters.role !== null) params = params.set('role', filters.role);
      if (filters.year) params = params.set('year', filters.year);
    }

    return this.http.get<ApiResponse<PagedResult<User>>>(this.apiUrl, { params });
  }

  getUserById(userId: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${user.userId}`, user);
  }

  deleteUser(userId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${userId}`);
  }

  getStandardUsersCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/standard`);
  }

  getTotalUsersCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/total`)
  }

  getAdminsCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/admins`);
  }

  getUsersByQuery(limit: number = 10, query : string) : Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('limit',limit).set('query',query);
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/search`, { params })
  }

  getUsersForEveryYear() : Observable<ApiResponse<UserYear[]>> {
    return this.http.get<ApiResponse<UserYear[]>>(`${this.apiUrl}/stats/year`);
  }

  getTopSpendingUsers(count: number = 5) : Observable<ApiResponse<UserRevenue[]>> {
    const params = new HttpParams().set('count', count);
    return this.http.get<ApiResponse<UserRevenue[]>>(`${this.apiUrl}/stats/topUsersSpending`, { params });
  }

  getUserPerMonthLastMonths(months : number = 6) : Observable<ApiResponse<UserMonth[]>> {
    const params = new HttpParams().set('months', months);
    return this.http.get<ApiResponse<UserMonth[]>>(`${this.apiUrl}/stats/usersForMonthThisYear`, { params });
  }

  getOrderPerUserRatio() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/stats/ordersPerUserRatio`);
  }

  getInactiveUsersCount(count : number = 5) : Observable<ApiResponse<number>> {
    const params = new HttpParams().set('months', count);
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/stats/inactiveUsersCount`, { params });
  }
}