//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

//Models
import { News } from '../models/News.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { PagedResult } from '../models/PagedResult';
import { NewsFilter } from '../models/filters/NewsFilter';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("NEWS");

  public getNews(pageIndex: number, pageSize: number, filters: NewsFilter): Observable<ApiResponse<PagedResult<News>>> {
    let params = new HttpParams();
    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<News>>>(this.apiUrl, { params });
  }

  public getCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  public deleteNews(id: number): Observable<ApiResponse<News>> {
    return this.http.delete<ApiResponse<News>>(`${this.apiUrl}/${id}`);
  }

  public createNews(news: News): Observable<ApiResponse<News>> {
    return this.http.post<ApiResponse<News>>(this.apiUrl, news);
  }

  public updateNews(news: News): Observable<ApiResponse<News>> {
    return this.http.put<ApiResponse<News>>(this.apiUrl, news);
  }

  private applyPagingParams(params: HttpParams, pageIndex: number, pageSize: number): HttpParams {
    return params
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  }

  private applyFilters(params: HttpParams, filters?: NewsFilter): HttpParams {
    if (filters) {
      if (filters.query) params = params.set('query', filters.query);
      if (filters.movieQuery) params = params.set('movieQuery', filters.movieQuery);
      if (filters.actorQuery) params = params.set('actorQuery', filters.actorQuery);
      if (filters.year && filters.year > 0) {
        params = params.set('year', filters.year.toString());
      }
    }
    return params;
  }
}