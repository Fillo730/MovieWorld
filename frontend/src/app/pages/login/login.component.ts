import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

import { emailValidator, passwordValidatorLogin } from '../../utils/authChecks';
import { ToastService } from '../../services/toast.service';
import { LoginRequest } from '../../models/LoginRequest.model';

@Component({
  selector: 'loginComponent',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    TranslatePipe,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  loginForm !: FormGroup;
  credentials !: LoginRequest
  isLoading = false;

  areCredentialsInvalid = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, passwordValidatorLogin]]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  handleGoBack() {
    this.router.navigate(["/home"]);
  }

  handleGoSignUp() {
    this.router.navigate(["/signup"]);
  }

  handleGoForgotPassword() {
    this.router.navigate(["/forgot-password"]);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.credentials = this.getCredentials();
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if(response.success) {
          this.toastService.success(this.translate.instant("Login.LoginSuccess"));
          this.router.navigate(['/home']);
        } else {
          this.toastService.error(this.translate.instant("Login.Errors.NotValidCredentials"));
          this.areCredentialsInvalid = true;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(this.translate.instant("Login.LoginFailure"));
      },
      complete: () => {
        this.isLoading = false;
        this.areCredentialsInvalid = false;
      }
    })

  }

  private getCredentials() : LoginRequest {
    return this.loginForm.value as LoginRequest;
  }
}