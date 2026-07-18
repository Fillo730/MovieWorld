import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';
import { ToastService } from '../../../services/toast.service';
import { CouponService } from '../../../services/coupon.service';
import { Coupon, CreateCouponRequest } from '../../../models/Coupon.model';

const EMPTY_FORM: CreateCouponRequest = {
  code: '',
  discountPercentage: 10,
  expiresAt: null,
  maxUses: null,
};

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslatePipe,
    StateHandlerComponent,
  ],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css',
})
export class CouponsComponent implements OnInit {
  private readonly couponService = inject(CouponService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  coupons: Coupon[] = [];
  isLoading = false;
  error = false;
  isCreating = false;

  form: CreateCouponRequest = { ...EMPTY_FORM };

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.isLoading = true;
    this.error = false;

    this.couponService.getAllCoupons().subscribe({
      next: (res) => {
        if (res.success) {
          this.coupons = res.data;
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  handleCreateCoupon(): void {
    if (!this.form.code.trim() || !this.form.discountPercentage) return;

    this.isCreating = true;

    const request: CreateCouponRequest = {
      ...this.form,
      code: this.form.code.trim().toUpperCase(),
    };

    this.couponService.createCoupon(request).subscribe({
      next: (res) => {
        this.isCreating = false;

        if (res.success) {
          this.toastService.success(this.translate.instant('Admin.CouponsPage.CreateSuccess'));
          this.form = { ...EMPTY_FORM };
          this.loadCoupons();
        } else {
          this.toastService.error(res.message);
        }
      },
      error: () => {
        this.isCreating = false;
        this.toastService.error(this.translate.instant('Admin.CouponsPage.CreateError'));
      }
    });
  }

  handleToggleCoupon(coupon: Coupon): void {
    this.couponService.toggleCoupon(coupon.couponId).subscribe({
      next: (res) => {
        if (res.success) {
          coupon.isActive = !coupon.isActive;
          this.toastService.success(this.translate.instant('Admin.CouponsPage.ToggleSuccess'));
        } else {
          this.toastService.error(res.message);
        }
      },
      error: () => {
        this.toastService.error(this.translate.instant('Admin.CouponsPage.ToggleError'));
      }
    });
  }

  isExpired(coupon: Coupon): boolean {
    return !!coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  }
}
