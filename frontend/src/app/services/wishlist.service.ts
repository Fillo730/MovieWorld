//Angular
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable, tap } from 'rxjs';

//Models
import { Movie } from '../models/Movie.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { PagedResult } from '../models/PagedResult';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("WISHLIST");

  private readonly _wishlistedIds = signal<Set<number>>(new Set());

  public readonly wishlistedIds = this._wishlistedIds.asReadonly();

  public refreshWishlistIds(): Observable<ApiResponse<number[]>> {
    return this.http.get<ApiResponse<number[]>>(`${this.apiUrl}/ids`).pipe(
      tap((response) => {
        if (response.success) this._wishlistedIds.set(new Set(response.data));
      })
    );
  }

  public getWishlist(pageIndex: number = 0, pageSize: number = 10): Observable<ApiResponse<PagedResult<Movie>>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<Movie>>>(this.apiUrl, { params });
  }

  public addToWishlist(movieId: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/${movieId}`, {}).pipe(
      tap((response) => {
        if (response.success) {
          const updated = new Set(this._wishlistedIds());
          updated.add(movieId);
          this._wishlistedIds.set(updated);
        }
      })
    );
  }

  public removeFromWishlist(movieId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${movieId}`).pipe(
      tap((response) => {
        if (response.success) {
          const updated = new Set(this._wishlistedIds());
          updated.delete(movieId);
          this._wishlistedIds.set(updated);
        }
      })
    );
  }

  public isWishlisted(movieId: number): boolean {
    return this._wishlistedIds().has(movieId);
  }

  public clearLocalWishlist(): void {
    this._wishlistedIds.set(new Set());
  }
}
