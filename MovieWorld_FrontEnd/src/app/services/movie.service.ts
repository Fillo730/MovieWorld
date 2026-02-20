import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/Movie.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { RETRIEVE_MOVIES_CULT_DEFAULT_QUANTITY, RETRIEVE_MOVIES_SAME_GENRE_DEFAULT_QUANTITY } from '../constants/DefaultQuantity';
import { PagedResult } from '../models/PagedResult';
import { MovieFilter } from '../models/filters/MovieFilter.model';
import { Genre } from '../models/Genre.model';
import { Format } from '../models/Format.model';
import { GenreStat } from '../models/stats/GenreStat.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = "https://localhost:7163/api/movies";

  constructor(private http: HttpClient) {}

  getMovies(pageIndex: number, pageSize: number, lang: string = DEFAULT_LANGUAGE, filters?: MovieFilter): Observable<ApiResponse<PagedResult<Movie>>> {
    let params = new HttpParams()
      .set('lang', lang)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<Movie>>>(this.apiUrl, { params });
  }

  getMovieById(id: number, lang: string = DEFAULT_LANGUAGE): Observable<Movie> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<ApiResponse<Movie>>(`${this.apiUrl}/${id}`, { params }).pipe(
      map(response => response.data)
    );
  }

  createMovie(movie: Movie, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.post<ApiResponse<Movie>>(this.apiUrl, movie, { params });
  }

  updateMovie(movie: Movie, id: number, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.put<ApiResponse<Movie>>(`${this.apiUrl}/${id}`, movie, { params });
  }

  getMoviesWithSameGenre(id: number, lang: string = DEFAULT_LANGUAGE, quantity: number = RETRIEVE_MOVIES_SAME_GENRE_DEFAULT_QUANTITY): Observable<Movie[]> {
    const params = new HttpParams().set('lang', lang).set('quantity', quantity);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/related/${id}`, { params }).pipe(
      map(response => response.data)
    );
  }

  getCultMovies(lang: string = DEFAULT_LANGUAGE, quantity: number = RETRIEVE_MOVIES_CULT_DEFAULT_QUANTITY): Observable<Movie[]> {
    const params = new HttpParams().set('lang', lang).set('quantity', quantity);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/cult`, { params }).pipe(
      map(response => response.data)
    );
  }

  getMoviesCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`);
  }

  deleteMovie(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`);
  }

  getGenres(lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Genre[]>> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<ApiResponse<Genre[]>>(`${this.apiUrl}/genres`, { params });
  }

  getFormats(): Observable<ApiResponse<Format[]>> {
    return this.http.get<ApiResponse<Format[]>>(`${this.apiUrl}/formats`);
  }

  getMoviesByQuery(limit: number, query: string, lang: string = DEFAULT_LANGUAGE): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('limit', limit).set('query', query).set('lang', lang);
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/search`, { params });
  }

  getMoviesCultCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count/cult`);
  }

  exportToExcel(filters: MovieFilter, lang: string = DEFAULT_LANGUAGE): Observable<Blob> {
    let params = new HttpParams().set('lang', lang);
    params = this.applyFilters(params, filters);

    return this.http.get(`${this.apiUrl}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getMoviesCountForEveryGenre(lang : string = DEFAULT_LANGUAGE) : Observable<ApiResponse<GenreStat[]>> {
    let params = new HttpParams().set('lang', lang);
    return this.http.get<ApiResponse<GenreStat[]>>(`${this.apiUrl}/stats/genres`, { params }); 
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