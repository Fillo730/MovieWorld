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
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { ImageTitleCard } from '../../components/image-title-card/image-title-card.component';
import { MyReviewsComponent } from '../../components/my-reviews/my-reviews.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user-service.server';
import { OrdersService } from '../../services/orders.service';
import { SellPointsService } from '../../services/sell-points.service';
import { MovieService } from '../../services/movie.service';
import { ToastService } from '../../services/toast.service';

import { User } from '../../models/User.model';
import { SellPoint } from '../../models/SellPoint.model';
import { Movie } from '../../models/Movie.model';
import { USER_ROLES } from '../../models/types/UserRole.model';
import { DEFAULT_ORDERS_FILTER } from '../../models/filters/OrdersFilter.model';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { getValidImagePath, PathType } from '../../utils/validURLPath';
import { nameValidator, surnameValidator, passwordValidatorSignUp } from '../../utils/authChecks';
import { goToMovieDetail } from '../../utils/navigationFunctions';
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
    DialogModule,
    ToggleSwitchModule,
    StateHandlerComponent,
    ImageTitleCard,
    MyReviewsComponent,
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
  private sellPointsService = inject(SellPointsService);
  private movieService = inject(MovieService);
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
  public sellPoints = signal<SellPoint[]>([]);
  public recommendedMovies = signal<Movie[]>([]);

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, nameValidator]],
    surname: ['', [Validators.required, surnameValidator]],
    imagePath: [''],
    preferredSellPointId: [null],
    emailNotificationsEnabled: [true]
  });

  private passwordMatchValidator = (form: any) => {
    const pass = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };

  public isChangingPassword = signal<boolean>(false);
  public isSavingPassword = signal<boolean>(false);
  public passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, passwordValidatorSignUp]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  public isDeletingAccount = signal<boolean>(false);
  public isConfirmingDelete = signal<boolean>(false);
  public deleteForm: FormGroup = this.fb.group({
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
    this.loadOrdersCount();
    this.loadSellPoints();
    this.loadRecommendations();
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

  loadSellPoints(): void {
    this.sellPointsService.getSellPoints(0, 100).subscribe(response => {
      if (response.success) this.sellPoints.set(response.data.items);
    });
  }

  loadRecommendations(): void {
    this.ordersService.getUsersOrders(0, 5, DEFAULT_ORDERS_FILTER).subscribe(response => {
      const lastPurchasedMovie = response.success
        ? response.data.items[0]?.items[0]?.movie
        : undefined;

      if (lastPurchasedMovie) {
        this.movieService.getMoviesWithSameGenre(lastPurchasedMovie.movieId, 6).subscribe(movies => {
          this.recommendedMovies.set(movies);
        });
      } else {
        this.movieService.getCultMovies(6).subscribe(movies => {
          this.recommendedMovies.set(movies);
        });
      }
    });
  }

  handleMovieClick(movie: Movie): void {
    goToMovieDetail(movie, this.router);
  }

  startEdit(): void {
    const current = this.user();
    if (!current) return;

    this.editForm.reset({
      name: current.name,
      surname: current.surname,
      imagePath: current.imagePath ?? '',
      preferredSellPointId: current.preferredSellPointId ?? null,
      emailNotificationsEnabled: current.emailNotificationsEnabled
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
          this.authService.updateLocalUser(response.data.name, response.data.imagePath, response.data.preferredSellPointId);
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

  openChangePassword(): void {
    this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.isChangingPassword.set(true);
  }

  closeChangePassword(): void {
    this.isChangingPassword.set(false);
  }

  isPasswordFieldInvalid(field: string): boolean {
    const control = this.passwordForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  passwordsMismatch(): boolean {
    return this.passwordForm.errors?.['passwordMismatch'] && this.passwordForm.get('confirmPassword')?.touched;
  }

  submitChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSavingPassword.set(true);

    this.userService.changeOwnPassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    }).pipe(
      finalize(() => this.isSavingPassword.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(this.translate.instant('Profile.PasswordChangeSuccess'));
          this.closeChangePassword();
        } else {
          this.toastService.error(this.translate.instant('Profile.PasswordChangeError'));
        }
      },
      error: () => {
        this.toastService.error(this.translate.instant('Profile.PasswordChangeError'));
      }
    });
  }

  openDeleteAccount(): void {
    this.deleteForm.reset({ password: '' });
    this.isDeletingAccount.set(true);
  }

  closeDeleteAccount(): void {
    this.isDeletingAccount.set(false);
  }

  isDeleteFieldInvalid(field: string): boolean {
    const control = this.deleteForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  confirmDeleteAccount(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    this.isConfirmingDelete.set(true);

    this.userService.deleteOwnAccount(this.deleteForm.value.password).pipe(
      finalize(() => this.isConfirmingDelete.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeDeleteAccount();
          this.authService.logout();
          this.toastService.success(this.translate.instant('Profile.DeleteAccountSuccess'));
          this.router.navigate(['/home']);
        } else {
          this.toastService.error(this.translate.instant('Profile.DeleteAccountError'));
        }
      },
      error: () => {
        this.toastService.error(this.translate.instant('Profile.DeleteAccountError'));
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

  getPreferredSellPointName(sellPointId: number | null | undefined): string {
    if (!sellPointId) return this.translate.instant('Profile.NotSetLabel');

    const sellPoint = this.sellPoints().find(sp => sp.id === sellPointId);
    return sellPoint ? `${sellPoint.name} (${sellPoint.city})` : this.translate.instant('Profile.NotSetLabel');
  }

  isAdmin(): boolean {
    return this.user()?.role === USER_ROLES.Admin;
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
