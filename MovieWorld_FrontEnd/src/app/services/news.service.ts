import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/News.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { PagedResult } from '../models/PagedResult';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { NewsFilter } from '../models/filters/NewsFilter';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7163/api/news';

  getNews(pageIndex: number, pageSize: number, filters: NewsFilter, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<PagedResult<News>>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('lang', lang);

    if (filters.query) params = params.set('query', filters.query);
    if (filters.movieQuery) params = params.set('movieQuery', filters.movieQuery);
    if (filters.actorQuery) params = params.set('actorQuery', filters.actorQuery);
    
    if (filters.year && filters.year > 0) {
      params = params.set('year', filters.year.toString());
  }

  return this.http.get<ApiResponse<PagedResult<News>>>(this.apiUrl, { params });
}

  getCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  deleteNews(id : number, lang : string = DEFAULT_LANGUAGE) : Observable<ApiResponse<News>> {
    let params = new HttpParams().set('lang', lang);
    return this.http.delete<ApiResponse<News>>(`${this.apiUrl}/${id}`, { params });
  }

  createNews(news : News, lang: string = DEFAULT_LANGUAGE) : Observable<ApiResponse<News>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.post<ApiResponse<News>>(this.apiUrl, news, { params });
  }

  updateNews(news : News, lang: string = DEFAULT_LANGUAGE) : Observable<ApiResponse<News>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.put<ApiResponse<News>>(this.apiUrl, news, { params });
  }
}