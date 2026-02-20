import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SellPoint } from '../models/SellPoint.model';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { ApiResponse } from '../models/ApiResponse.model';
import { SellPointsFilter } from '../models/filters/SellPointsFilter.model';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root',
})
export class SellPointsService {
  private api_url = "https://localhost:7163/api/sellpoints";

  constructor(private http: HttpClient) {}

  getSellPoints(pageIndex: number, pageSize: number, lang: string = DEFAULT_LANGUAGE, filters?: SellPointsFilter): Observable<ApiResponse<PagedResult<SellPoint>>> {
    let params = new HttpParams()
      .set("lang", lang)
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString());

    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<SellPoint>>>(this.api_url, { params });
  }

  getCities(lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<string[]>> {
    let params = new HttpParams().set("lang", lang);
    return this.http.get<ApiResponse<string[]>>(`${this.api_url}/cities`, { params });
  }

  getNearest(lat: number, lng: number, limit: number = 3, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<SellPoint[]>> {
    const params = new HttpParams()
      .set("userLat", lat.toString())
      .set("userLng", lng.toString())
      .set("limit", limit.toString())
      .set("lang", lang);

    return this.http.get<ApiResponse<SellPoint[]>>(`${this.api_url}/nearest`, { params });
  }

  getSellPointsByMovies(pageIndex: number, pageSize: number, lang: string = DEFAULT_LANGUAGE, movieIds: number[], latUser?: number, lngUser?: number): Observable<ApiResponse<PagedResult<SellPoint>>> {
    let params = new HttpParams()
      .set("lang", lang)
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString());

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

  getSellPointsByQuery(limit: number, query: string, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<SellPoint[]>> {
    const params = new HttpParams().set('limit', limit).set('query', query).set('lang', lang);
    return this.http.get<ApiResponse<SellPoint[]>>(`${this.api_url}/search`, { params });
  }

  exportToExcel(filters: SellPointsFilter, lang: string = DEFAULT_LANGUAGE): Observable<Blob> {
    let params = new HttpParams().set('lang', lang);
    params = this.applyFilters(params, filters);

    return this.http.get(`${this.api_url}/export`, { 
      params, 
      responseType: 'blob' 
    });
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