import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user-service.server';
import { OrdersService } from '../../services/orders.service';
import { ToastService } from '../../services/toast.service';

import { User } from '../../models/User.model';
import { USER_ROLES } from '../../models/types/UserRole.model';
import { DEFAULT_ORDERS_FILTER } from '../../models/filters/OrdersFilter.model';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { getValidImagePath, PathType } from '../../utils/validURLPath';
import { nameValidator, surnameValidator } from '../../utils/authChecks';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Footer,
    AvatarModule,
    ButtonModule,
    DividerModule,
    TagModule,
    FieldsetModule,
    InputTextModule,
    MessageModule,
    StateHandlerComponent,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private userService = inject(UserService);
  private ordersService = inject(OrdersService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public user = signal<User | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<boolean>(false);

  public isEditing = signal<boolean>(false);
  public isSaving = signal<boolean>(false);

  public ordersCount = signal<number | null>(null);

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, nameValidator]],
    surname: ['', [Validators.required, surnameValidator]],
    imagePath: ['']
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
    this.loadOrdersCount();
  }

  loadProfile(): void {
    const userId = this.authService.userId();
    if (!userId) return;

    this.isLoading.set(true);
    this.error.set(false);

    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.user.set(response.data);
        } else {
          this.error.set(true);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadOrdersCount(): void {
    this.ordersService.getUsersOrders(0, 1, DEFAULT_ORDERS_FILTER).subscribe(response => {
      if (response.success) this.ordersCount.set(response.data.totalCount);
    });
  }

  startEdit(): void {
    const current = this.user();
    if (!current) return;

    this.editForm.reset({
      name: current.name,
      surname: current.surname,
      imagePath: current.imagePath ?? ''
    });
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  isInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  saveProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    this.userService.updateOwnProfile(this.editForm.value).pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.user.set(response.data);
          this.authService.updateLocalUser(response.data.name, response.data.imagePath);
          this.toastService.success(this.translate.instant('Profile.UpdateSuccess'));
          this.isEditing.set(false);
        } else {
          this.toastService.error(this.translate.instant('Profile.UpdateError'));
        }
      },
      error: () => {
        this.toastService.error(this.translate.instant('Profile.UpdateError'));
      }
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }

  goToOrders(): void {
    this.router.navigate(['/your-orders']);
  }

  getAvatarImage(path: string | undefined): string {
    return getValidImagePath(path, PathType.person);
  }

  isAdmin(): boolean {
    return this.user()?.role === USER_ROLES.Admin;
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
