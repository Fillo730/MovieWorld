import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/ApiResponse.model';
import { MovieReviewsSummary } from '../models/MovieReviewsSummary.model';
import { Review } from '../models/Review.model';
import { UserReview } from '../models/UserReview.model';
import { PagedResult } from '../models/PagedResult';

import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("REVIEWS");

  public getMovieReviews(movieId: number, pageIndex: number = 0, pageSize: number = 10): Observable<ApiResponse<MovieReviewsSummary>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<MovieReviewsSummary>>(`${this.apiUrl}/movie/${movieId}`, { params });
  }

  public getMyReviews(pageIndex: number = 0, pageSize: number = 5): Observable<ApiResponse<PagedResult<UserReview>>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<UserReview>>>(`${this.apiUrl}/mine`, { params });
  }

  public getMyReview(movieId: number): Observable<ApiResponse<Review | null>> {
    return this.http.get<ApiResponse<Review | null>>(`${this.apiUrl}/movie/${movieId}/mine`);
  }

  public upsertReview(movieId: number, rating: number, comment: string): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.apiUrl}/movie/${movieId}`, { rating, comment });
  }

  public deleteReview(reviewId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${reviewId}`);
  }
}
