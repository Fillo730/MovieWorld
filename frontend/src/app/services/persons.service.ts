//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

//Models
import { ApiResponse } from '../models/ApiResponse.model';
import { Person } from '../models/Person.model';
import { PersonsFilter } from '../models/filters/PersonsFilter.model';
import { PagedResult } from '../models/PagedResult';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("PERSONS");

  public getPersons(
    pageIndex: number = 0, 
    pageSize: number = 10, 
    filters?: PersonsFilter
  ): Observable<ApiResponse<PagedResult<Person>>> {
    
    let params = new HttpParams();
    params = this.applyPagingParams(params, pageIndex, pageSize);
    params = this.applyFilters(params, filters);

    return this.http.get<ApiResponse<PagedResult<Person>>>(this.apiUrl, { params });
  }

  public searchPeople(query: string): Observable<ApiResponse<Person[]>> {
    const params = new HttpParams().set("query", query);
    return this.http.get<ApiResponse<Person[]>>(`${this.apiUrl}/search`, { params });
  }

  public createPerson(person: Person): Observable<ApiResponse<Person>> {
    return this.http.post<ApiResponse<Person>>(this.apiUrl, person);
  }

  public updatePerson(person: Person): Observable<ApiResponse<Person>> {
    return this.http.put<ApiResponse<Person>>(this.apiUrl, person);
  }

  public deletePerson(personId : number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${personId}`);
  }

  public getTotalPersonCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/total`);
  }

  public getActorsCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/actor`);
  }

  public getDirectorsPersonCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/director`);
  }

  private applyPagingParams(params: HttpParams, pageIndex: number, pageSize: number): HttpParams {
    return params
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  }

  private applyFilters(params: HttpParams, filters?: PersonsFilter): HttpParams {
    if (filters) {
      if (filters.query) params = params.set('query', filters.query);
      if (filters.role) params = params.set('role', filters.role);
    }
    return params;
  }
}