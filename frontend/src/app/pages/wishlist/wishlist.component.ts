import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { MoviesListComponent } from '../../components/movies-list/movies-list.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';

import { WishlistService } from '../../services/wishlist.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslatePipe } from '@ngx-translate/core';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { Movie } from '../../models/Movie.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [Header, Footer, MoviesListComponent, StateHandlerComponent, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  movies: Movie[] = [];

  error: boolean = false;
  isLoading: boolean = false;

  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;

  public lang = this.languageService.currentLanguage;

  constructor() {
    effect(() => {
      this.lang();
      this.wishlistService.wishlistedIds();
      this.loadWishlist();
    });
  }

  loadWishlist() {
    this.isLoading = true;
    this.error = false;

    const pageIndex = Math.floor(this.first / this.rows);

    this.wishlistService.getWishlist(pageIndex, this.rows).subscribe({
      next: (response) => {
        if (response.success) {
          this.movies = response.data.items;
          this.totalRecords = response.data.totalCount;
        } else {
          this.error = true;
          this.movies = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadWishlist();
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
