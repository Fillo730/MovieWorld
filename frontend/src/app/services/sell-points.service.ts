//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

//Models
import { SellPoint } from '../models/SellPoint.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { SellPointsFilter } from '../models/filters/SellPointsFilter.model';
import { PagedResult } from '../models/PagedResult';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class SellPointsService {
  private readonly http = inject(HttpClient);
  private readonly api_url = getApiUrl("SELL_POINTS");

  public getSellPoints(pageIndex: number, pageSize: number, filters?: SellPointsFilter): Observable<ApiResponse<PagedResult<SellPoint>>> {
    let params = new HttpParams();
    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<SellPoint>>>(this.api_url, { params });
  }

  public getCities(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.api_url}/cities`);
  }

  public getNearest(lat: number, lng: number, limit: number = 3): Observable<ApiResponse<SellPoint[]>> {
    const params = new HttpParams()
      .set("userLat", lat.toString())
      .set("userLng", lng.toString())
      .set("limit", limit.toString());

    return this.http.get<ApiResponse<SellPoint[]>>(`${this.api_url}/nearest`, { params });
  }

  public getSellPointsByMovies(pageIndex: number, pageSize: number, movieIds: number[], latUser?: number, lngUser?: number): Observable<ApiResponse<PagedResult<SellPoint>>> {
    let params = new HttpParams();
    params = this.applyPagingParams(params, pageIndex, pageSize);

    if (movieIds?.length > 0) {
      movieIds.forEach(id => {
        params = params.append("movieIds", id.toString());
      });
    }

    if (latUser !== undefined && lngUser !== undefined) {
      params = params.set("userLat", latUser.toString()).set("userLng", lngUser.toString());
    }

    return this.http.get<ApiResponse<PagedResult<SellPoint>>>(`${this.api_url}/bymovies`, { params });
  }

  public getSellPointsByQuery(limit: number, query: string): Observable<ApiResponse<SellPoint[]>> {
    const params = new HttpParams().set('limit', limit).set('query', query);
    return this.http.get<ApiResponse<SellPoint[]>>(`${this.api_url}/search`, { params });
  }

  public exportToExcel(filters: SellPointsFilter): Observable<Blob> {
    let params = this.applyFilters(new HttpParams(), filters);

    return this.http.get(`${this.api_url}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  private applyPagingParams(params: HttpParams, pageIndex: number, pageSize: number): HttpParams {
    return params
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  }

  private applyFilters(params: HttpParams, filters?: SellPointsFilter): HttpParams {
    if (filters) {
      if (filters.city) {
        params = params.set("city", filters.city);
      }
    }
    return params;
  }
}