//Angular
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable, tap } from 'rxjs';

//Models
import { ApiResponse } from '../models/ApiResponse.model';
import { AppNotification } from '../models/Notification.model';
import { PagedResult } from '../models/PagedResult';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("NOTIFICATIONS");

  private readonly _unreadCount = signal<number>(0);

  public readonly unreadCount = this._unreadCount.asReadonly();

  public refreshUnreadCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/unread-count`).pipe(
      tap(response => {
        if (response.success) this._unreadCount.set(response.data);
      })
    );
  }

  public getNotifications(pageIndex: number = 0, pageSize: number = 10): Observable<ApiResponse<PagedResult<AppNotification>>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<AppNotification>>>(this.apiUrl, { params });
  }

  public markAsRead(notificationId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(response => {
        if (response.success) this._unreadCount.set(Math.max(0, this._unreadCount() - 1));
      })
    );
  }

  public markAllAsRead(): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(response => {
        if (response.success) this._unreadCount.set(0);
      })
    );
  }

  public clearLocalState(): void {
    this._unreadCount.set(0);
  }
}
