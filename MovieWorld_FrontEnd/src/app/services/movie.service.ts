//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable, map } from 'rxjs';

//Models
import { PagedResult } from '../models/PagedResult';
import { MovieFilter } from '../models/filters/MovieFilter.model';
import { Genre } from '../models/Genre.model';
import { Format } from '../models/Format.model';
import { GenreStat } from '../models/stats/GenreStat.model';
import { Movie } from '../models/Movie.model';
import { ApiResponse } from '../models/ApiResponse.model';

//Constants
import { RETRIEVE_MOVIES_CULT_DEFAULT_QUANTITY, RETRIEVE_MOVIES_SAME_GENRE_DEFAULT_QUANTITY } from '../constants/DefaultQuantity';
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("MOVIES");

  public getMovies(pageIndex: number, pageSize: number, filters?: MovieFilter): Observable<ApiResponse<PagedResult<Movie>>> {
    let params = new HttpParams();
    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<Movie>>>(this.apiUrl, { params });
  }

  public getMovieById(id: number): Observable<Movie> {
    return this.http.get<ApiResponse<Movie>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  public createMovie(movie: Movie): Observable<ApiResponse<Movie>> {
    return this.http.post<ApiResponse<Movie>>(this.apiUrl, movie);
  }

  public updateMovie(movie: Movie, id: number): Observable<ApiResponse<Movie>> {
    return this.http.put<ApiResponse<Movie>>(`${this.apiUrl}/${id}`, movie);
  }

  public getMoviesWithSameGenre(id: number, quantity: number = RETRIEVE_MOVIES_SAME_GENRE_DEFAULT_QUANTITY): Observable<Movie[]> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/related/${id}`, { params }).pipe(
      map(response => response.data)
    );
  }

  public getCultMovies(quantity: number = RETRIEVE_MOVIES_CULT_DEFAULT_QUANTITY): Observable<Movie[]> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/cult`, { params }).pipe(
      map(response => response.data)
    );
  }

  public getMoviesCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  public deleteMovie(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`);
  }

  public getGenres(): Observable<ApiResponse<Genre[]>> {
    return this.http.get<ApiResponse<Genre[]>>(`${this.apiUrl}/genres`);
  }

  public getFormats(): Observable<ApiResponse<Format[]>> {
    return this.http.get<ApiResponse<Format[]>>(`${this.apiUrl}/formats`);
  }

  public getMoviesByQuery(limit: number, query: string): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('limit', limit).set('query', query);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/search`, { params });
  }

  public getMoviesCultCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count/cult`);
  }

  public exportToExcel(filters: MovieFilter): Observable<Blob> {
    let params = this.applyFilters(new HttpParams(), filters);

    return this.http.get(`${this.apiUrl}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  public getMoviesCountForEveryGenre(): Observable<ApiResponse<GenreStat[]>> {
    return this.http.get<ApiResponse<GenreStat[]>>(`${this.apiUrl}/stats/genres`); 
  }

  private applyPagingParams(params: HttpParams, pageIndex: number, pageSize: number): HttpParams {
    return params
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  }

  private applyFilters(params: HttpParams, filters?: MovieFilter): HttpParams {
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.genre) params = params.set('genre', filters.genre);
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.director) params = params.set('director', filters.director);
      if (filters.actor) params = params.set('actor', filters.actor);
      if (filters.priceRange) {
        params = params.set('minPrice', filters.priceRange[0].toString());
        params = params.set('maxPrice', filters.priceRange[1].toString());
      }
    }
    return params;
  }
}