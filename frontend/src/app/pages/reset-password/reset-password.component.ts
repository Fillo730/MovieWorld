import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { passwordValidatorSignUp } from '../../utils/authChecks';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    TranslatePipe,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  resetPasswordForm !: FormGroup;
  isLoading = false;
  isSubmitted = false;
  token: string | null = null;

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, passwordValidatorSignUp]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator = (form: any) => {
    const pass = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };

  isInvalid(field: string): boolean {
    const control = this.resetPasswordForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  passwordsMismatch(): boolean {
    return this.resetPasswordForm.errors?.['passwordMismatch'] && this.resetPasswordForm.get('confirmPassword')?.touched;
  }

  handleGoBack() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.resetPasswordForm.value.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.isSubmitted = true;
          this.toastService.success(this.translate.instant('ResetPassword.SuccessMessage'));
        } else {
          this.toastService.error(this.translate.instant('ResetPassword.ErrorMessage'));
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error(this.translate.instant('ResetPassword.ErrorMessage'));
      }
    });
  }
}
