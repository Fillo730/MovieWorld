import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { MoviesListComponent } from '../../components/movies-list/movies-list.component';
import { MoviesFiltersComponent } from '../../components/movies-filters/movies-filters.component';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/theme.service';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { Movie } from '../../models/Movie.model';
import { DEFAULT_MOVIES_FILTERS, MovieFilter } from '../../models/filters/MovieFilter.model';
import { Genre } from '../../models/Genre.model';
import { AuthService } from '../../services/auth-service.service';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { CartService } from '../../services/cart.service';
import { getDownloadButtonTheme } from '../../utils/themeFunctions';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    Header,
    Footer,
    MoviesFiltersComponent,
    StateHandlerComponent,
    MoviesListComponent,
    TranslatePipe,
    ButtonModule
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class Catalog implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly movieService = inject(MovieService);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);

  filters: MovieFilter = { ...DEFAULT_MOVIES_FILTERS };
  movies: Movie[] = [];
  genres: Genre[] = [];

  error: boolean = false;
  isLoading: boolean = false;
  isLoadingButton : boolean = false;
  
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;

  public lang = this.languageService.currentLanguage;

  ngOnInit() {
    this.loadMovies();
    this.loadGenres();

    this.translateService.onLangChange.subscribe(() => {
      this.lang();
      this.loadMovies();
      this.loadGenres();
    })
  }

  loadMovies() {
    this.isLoading = true;
    this.error = false;

    const pageIndex = Math.floor(this.first / this.rows);

    this.movieService.getMovies(pageIndex, this.rows, this.lang(), this.filters).subscribe({
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
      error: (err) => {
        this.error = true;
        this.isLoading = false;
        console.error("Errore di rete:", err);
      }
    });
  }

  loadGenres() {
    this.movieService.getGenres(this.lang()).subscribe(response => {
      if (response.success) {
        this.genres = response.data;
      }
    });
  }

  downloadExcel() {
    this.isLoadingButton = true;
    this.movieService.exportToExcel(this.filters, this.lang()).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.translateService.instant("Catalog.FileExcelName");
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoadingButton = false;
    })
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadMovies();
  }

  applyFilters() {
    this.first = 0;
    this.loadMovies();
  }

  handleResetFilters() {
    this.isLoading = true;
    this.filters = { ...DEFAULT_MOVIES_FILTERS };
    this.first = 0;
    this.loadMovies();
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }

  getDownloadButtonTheme()  {
    return getDownloadButtonTheme(this.themeService.isDark());
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}