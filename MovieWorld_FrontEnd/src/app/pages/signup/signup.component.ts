//Angular
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

//External Libraries
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

//i18n
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

//Services
import { LanguageService } from '../../services/language.service';

//Utils
import { emailValidator, passwordValidatorLogin, nameValidator, surnameValidator} from '../../utils/authChecks';
import { RegisterRequest } from '../../models/RegisterRequest.model';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    TranslatePipe
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class Signup {

  signupForm !: FormGroup;
  credentials !: RegisterRequest;
  isLoading : boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private languageService : LanguageService, 
    private toastService : ToastService, private authService : AuthService, private translateService : TranslateService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, nameValidator]],
      lastName: ['', [Validators.required, surnameValidator]],
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, passwordValidatorLogin]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
  }

  passwordMatchValidator = (form: any) => {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return pass === confirm ? null : { passwordMismatch: true };
  };

  isInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  handleGoBack() {
    this.router.navigate(["/home"]);
  }

  handleGoLogin() {
    this.router.navigate(["/login"])
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
    }

    this.isLoading = true;
    this.credentials = this.getCredentials();
    console.log(this.credentials);

    this.authService.register(this.credentials).subscribe({
      next: (response => {
        this.toastService.success(this.translateService.instant("SignUp.SignupSuccess"));
        this.router.navigate(['/home']);
      }),
      error: (err) => {
        this.toastService.error(this.translateService.instant("SignUp.SignupError"));
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  private getCredentials() : RegisterRequest {
    const {confirmPassword, ...rest} = this.signupForm.value;
    return rest as RegisterRequest; 
  }
}