//Angular Core
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

//rxjs
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';

//External Libraries
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

//Components
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';

//i18n
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

//Services
import { CartService } from '../../services/cart.service';
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";
import { AuthService } from '../../services/auth.service';
import { DEFAULT_AVATAR } from '../../utils/validURLPath';
import { ToastService } from '../../services/toast.service';
import { MovieService } from '../../services/movie.service';

//Models
import { Movie } from '../../models/Movie.model';

//Utils
import { goToMovieDetail } from '../../utils/navigationFunctions';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AvatarModule,
    AvatarGroupModule,
    OverlayBadgeModule,
    TranslatePipe,
    ThemeTogglerComponent,
    LanguageSelectorComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header {
  cartService : CartService = inject(CartService);
  router : Router = inject(Router);
  authService : AuthService = inject(AuthService);
  toastService : ToastService = inject(ToastService);
  translateService : TranslateService = inject(TranslateService);
  movieService : MovieService = inject(MovieService);

  searchQuery: string = '';
  searchResults: Movie[] = [];
  isSearching: boolean = false;
  showSearchResults: boolean = false;

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();

        if (trimmed.length < 2) {
          return of(null);
        }

        this.isSearching = true;

        return this.movieService.getMoviesByQuery(6, trimmed).pipe(
          finalize(() => this.isSearching = false)
        );
      })
    ).subscribe(response => {
      this.searchResults = response?.success ? response.data : [];
    });
  }

  handleSearchInput(): void {
    this.showSearchResults = this.searchQuery.trim().length >= 2;
    this.searchSubject.next(this.searchQuery);
  }

  handleSearchFocus(): void {
    if (this.searchQuery.trim().length >= 2) {
      this.showSearchResults = true;
    }
  }

  handleSearchBlur(): void {
    setTimeout(() => this.showSearchResults = false, 150);
  }

  handleSelectSearchResult(movie: Movie): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    goToMovieDetail(movie, this.router);
  }

  isCartEmpty() {
    return this.cartService.isEmpty();
  }

  getCartNumberOfItems() {
    return this.cartService.itemsCount();
  }

  handleGoToCart() {
    this.router.navigate(['/cart']);
  }

  handleLogout() {
    this.authService.logout();
    this.toastService.success(this.translateService.instant('Header.LogoutMessage'));
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getProfileImage() {
    return this.authService.imagePath() ?? DEFAULT_AVATAR;
  }
}