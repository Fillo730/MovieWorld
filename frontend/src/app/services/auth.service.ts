//Angular
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Rxjs
import { Observable, tap } from 'rxjs';

//Services
import { StorageService } from './storage.service';

//Models
import { LoginRegisterResponse } from '../models/LoginRegisterResponse.model';
import { ApiResponse } from '../models/ApiResponse.model';
import { LoginRequest } from '../models/LoginRequest.model';
import { RegisterRequest } from '../models/RegisterRequest.model';
import { USER_ROLES } from '../models/types/UserRole.model';

//Constants
import { getApiUrl } from '../constants/app.config';
import { STORAGE_KEYS } from '../constants/storageKeys';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);

  private readonly storageKey = STORAGE_KEYS.USER_DATA;
  private readonly apiUrl = getApiUrl("AUTH");

  private readonly _currentUser = signal<LoginRegisterResponse | null>(this.getUserFromStorage());
  
  public readonly currentUser = this._currentUser.asReadonly();

  public readonly isAdmin = computed(() => this._currentUser()?.role === USER_ROLES.Admin);

  public readonly name = computed(() => this._currentUser()?.name ?? '');

  public readonly imagePath = computed(() => this._currentUser()?.imagePath);

  public readonly userId = computed(() => this._currentUser()?.id);

  public readonly preferredSellPointId = computed(() => this._currentUser()?.preferredSellPointId);

  public login(credentials: LoginRequest): Observable<ApiResponse<LoginRegisterResponse>> {
    return this.http.post<ApiResponse<LoginRegisterResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response?.success) this.saveUser(response.data);
      })
    );
  }

  public register(credentials: RegisterRequest): Observable<ApiResponse<LoginRegisterResponse>> {
    return this.http.post<ApiResponse<LoginRegisterResponse>>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => {
        if (response?.success) this.saveUser(response.data);
      })
    );
  }
  
  public updateLocalUser(name: string, imagePath: string, preferredSellPointId?: number | null): void {
    const user = this._currentUser();
    if (!user) return;

    this.saveUser({ ...user, name, imagePath, preferredSellPointId });
  }

  private saveUser(data: LoginRegisterResponse): void {
    this.storageService.setItem(this.storageKey, data);
    this._currentUser.set(data);
  }

  private getUserFromStorage(): LoginRegisterResponse | null {
    return this.storageService.getItem<LoginRegisterResponse>(this.storageKey);
  }

  public logout(): void {
    this.storageService.removeItem(this.storageKey);
    this._currentUser.set(null);
  }

  public isLoggedIn(): boolean {
    const user = this._currentUser();

    if (!user || !user.expiration) return false;

    const isValid = new Date(user.expiration) > new Date();
    if (!isValid) this.logout();

    return isValid;
  }
}