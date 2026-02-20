import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { Person } from '../models/Person.model';
import { DEFAULT_LANGUAGE } from '../constants/DefaultLanguage';
import { PersonsFilter } from '../models/filters/PersonsFilter.model';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = "https://localhost:7163/api/persons";

  constructor(private http: HttpClient) {}

  getPersons(
    pageIndex: number = 0, 
    pageSize: number = 10, 
    lang: string = DEFAULT_LANGUAGE, 
    filters?: PersonsFilter
  ): Observable<ApiResponse<PagedResult<Person>>> {
    
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('lang', lang);

    if (filters) {
      if (filters.query) params = params.set('query', filters.query);
      if (filters.role) params = params.set('role', filters.role);
    }

    return this.http.get<ApiResponse<PagedResult<Person>>>(this.apiUrl, { params });
  }

  searchPeople(query: string): Observable<ApiResponse<Person[]>> {
    const params = new HttpParams().set("query", query);
    return this.http.get<ApiResponse<Person[]>>(`${this.apiUrl}/search`, { params });
  }

  createPerson(person: Person): Observable<ApiResponse<Person>> {
    return this.http.post<ApiResponse<Person>>(this.apiUrl, person);
  }

  updatePerson(person: Person): Observable<ApiResponse<Person>> {
    return this.http.put<ApiResponse<Person>>(this.apiUrl, person);
  }

  deletePerson(personId : number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${personId}`);
  }

  getTotalPersonCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/total`);
  }

  getActorsCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/actor`);
  }

  getDirectorsPersonCount() : Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/counts/director`);
  }
}