//Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

//Models
import { ApiResponse } from '../models/ApiResponse.model';
import { CouponValidationResult } from '../models/CouponValidationResult.model';
import { Coupon, CreateCouponRequest } from '../models/Coupon.model';

//Constants
import { getApiUrl } from '../constants/app.config';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = getApiUrl("COUPONS");

  public validateCoupon(code: string, subtotal: number): Observable<ApiResponse<CouponValidationResult>> {
    return this.http.post<ApiResponse<CouponValidationResult>>(`${this.apiUrl}/validate`, { code, subtotal });
  }

  public getAllCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(this.apiUrl);
  }

  public createCoupon(request: CreateCouponRequest): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(this.apiUrl, request);
  }

  public toggleCoupon(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${id}/toggle`, {});
  }
}
