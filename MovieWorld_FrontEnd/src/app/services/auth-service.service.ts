//Angular
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Rxjs
import { Observable, tap } from 'rxjs';

//Models
import { LoginRegisterResponse } from '../models/LoginRegisterResponse.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { LoginRequest } from '../models/LoginRequest.model';
import { RegisterRequest } from '../models/RegisterRequest.model';

//Utils
import { AUTH_CONTROLLER_URL } from '../utils/apiUrl';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private http : HttpClient = inject(HttpClient);

  private apiUrl = AUTH_CONTROLLER_URL;
  private storageKey = 'user_data';
  
  currentUser = signal<LoginRegisterResponse | null>(this.getUserFromStorage());

  login(credentials: LoginRequest) : Observable<ApiResponse<LoginRegisterResponse>> {
    return this.http.post<ApiResponse<LoginRegisterResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if(response && response.success) {
          this.saveUser(response.data);
        }
      })
    );
  }

  register(credentials : RegisterRequest) : Observable<ApiResponse<LoginRegisterResponse>> {
    return this.http.post<ApiResponse<LoginRegisterResponse>>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => {
        if(response && response.success) {
          this.saveUser(response.data);
        }
      })
    )
  }
  
  private saveUser(data: LoginRegisterResponse) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.currentUser.set(data);
  }

  private getUserFromStorage(): LoginRegisterResponse | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role == 1;
  }

  getUserName() {
    return this.currentUser()?.name;
  }

  getImagePath() {
    return this.currentUser()?.imagePath;
  }

  getId() : number | undefined{
    return this.currentUser()?.id;
  }

  isLoggedIn() : boolean {
     const user = this.currentUser();

     if(!user || !user.expiration) {
      return false;
     }

     const expirationDate = new Date(user.expiration);
     const now = new Date();

     const isValid = expirationDate > now;

     if(!isValid) this.logout();

     return true;
    
  }
}