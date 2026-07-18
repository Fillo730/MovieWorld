import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { emailValidator } from '../../utils/authChecks';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    TranslatePipe,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  forgotPasswordForm !: FormGroup;
  isLoading = false;
  isSubmitted = false;

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  handleGoBack() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSubmitted = true;
        this.toastService.success(this.translate.instant('ForgotPassword.SuccessMessage'));
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error(this.translate.instant('ForgotPassword.ErrorMessage'));
      }
    });
  }
}
