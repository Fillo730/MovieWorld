import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { MoviesListComponent } from '../../../components/movies-list/movies-list.component';
import { MoviesFiltersMaterialComponent } from '../../../components/movie-filters-material/movie-filters-material.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';
import { ToastService } from '../../../services/toast.service';
import { UpdateCreateMovieDialogComponent } from '../../../components/update-create-movie-dialog/update-create-movie-dialog.component';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models/Movie.model';
import { LanguageService } from '../../../services/language.service';
import { DEFAULT_MOVIES_FILTERS } from '../../../models/filters/MovieFilter.model';
import { Genre } from '../../../models/Genre.model';
import { Format } from '../../../models/Format.model';

@Component({
  selector: 'movies-component',
  standalone: true,
  imports: [
    CommonModule,
    MoviesListComponent,
    MoviesFiltersMaterialComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    TranslateModule,
    TranslatePipe,
    StateHandlerComponent
  ],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class MoviesAdmimComponent implements OnInit {
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  private movieService = inject(MovieService);
  private languageService = inject(LanguageService);
  
  movies: Movie[] = [];
  genres: Genre[] = [];
  formats: Format[] = [];
  countMovies: number = -1;

  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;

  isLoading: boolean = false;
  hasError: boolean = false;

  public lang = this.languageService.currentLanguage;

  filters = { ...DEFAULT_MOVIES_FILTERS };

  ngOnInit() {
    this.loadMovies();
    this.loadGenres();
    this.loadFormats();
  }

  loadMovies() {
    this.isLoading = true;
    this.hasError = false;
    const pageIndex = Math.floor(this.first / this.rows);

    this.movieService.getMovies(pageIndex, this.rows, this.lang(), this.filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.movies = response.data.items;
          this.totalRecords = response.data.totalCount;
        } else {
          this.hasError = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });

    this.movieService.getMoviesCount().subscribe(response => {
      if (response.success) {
        this.countMovies = response.data;
      } else {
        this.countMovies = 0;
      }
    });
  }

  loadGenres() {
    this.movieService.getGenres(this.lang()).subscribe(response => {
      if (response.success) this.genres = response.data;
    });
  }

  loadFormats() {
    this.movieService.getFormats().subscribe(response => {
      if (response.success) this.formats = response.data;
    });
  }

  applyFilters() {
    this.first = 0;
    this.loadMovies();
  }

  handlePageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadMovies();
  }

  resetFilters() {
    this.filters = { ...DEFAULT_MOVIES_FILTERS };
    this.first = 0;
    this.loadMovies();
  }

  deleteMovie(movieId: number): void {
    const movieToDelete = this.movies.find(m => m.movieId === movieId);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('Admin.MoviesPage.Dialog.DeleteTitle'),
        text: this.translate.instant('Admin.MoviesPage.Dialog.DeleteConfirm', { name: movieToDelete?.title }),
        cancelButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Delete'),
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.deleteMovie(movieId).subscribe(response => {
          if (response.success) {
            this.loadMovies();
            this.toastService.success(this.translate.instant('Admin.MoviesPage.Messages.DeleteSuccess'));
          }
        });
      }
    });
  }

  updateMovie(movieId: number): void {
    const movie = this.movies.find(m => m.movieId === movieId);
    if (!movie) return;

    const dialogRef = this.dialog.open(UpdateCreateMovieDialogComponent, {
      width: '600px',
      data: {
        title: this.translate.instant('Admin.MoviesPage.Dialog.EditTitle'),
        successButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Update'),
        cancelButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Cancel'),
        genres: this.genres,
        formats: this.formats,
        movie: { ...movie }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.updateMovie(result, movieId, this.lang()).subscribe(response => {
          if (response.success) {
            this.loadMovies();
            this.toastService.success(this.translate.instant('Admin.MoviesPage.Messages.UpdateSuccess', { title: result.title }));
          }
        });
      }
    });
  }

  addMovie(): void {
    const dialogRef = this.dialog.open(UpdateCreateMovieDialogComponent, {
      width: '600px',
      data: {
        title: this.translate.instant('Admin.MoviesPage.Dialog.AddTitle'),
        successButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Add'),
        cancelButtonLabel: this.translate.instant('Admin.MoviesPage.Buttons.Cancel'),
        genres: this.genres,
        formats: this.formats,
        movie: null
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.createMovie(result, this.lang()).subscribe(response => {
          if (response.success) {
            this.loadMovies();
            this.toastService.success(this.translate.instant('Admin.MoviesPage.Messages.AddSuccess', { title: result.title }));
          }
        });
      }
    });
  }
}