import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { ImageTitleCard } from '../../components/image-title-card/image-title-card.component';
import { MovieDetailCard } from '../../components/movie-detail-card/movie-detail-card.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../services/cart.service';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { Movie } from '../../models/Movie.model';
import { scrollToTop } from '../../utils/windowFunctions';
import { goToMovieDetail } from '../../utils/navigationFunctions';
import { AuthService } from '../../services/auth.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    Header, 
    Footer, 
    ButtonModule, 
    TabsModule, 
    ImageTitleCard, 
    MovieDetailCard, 
    StateHandlerComponent,
    TranslatePipe
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetail implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  
  movie!: Movie;
  moviesWithSameGenre: Movie[] = [];
  value = 0;
  isLoading: boolean = false;
  error: boolean = false;

  public lang = this.languageService.currentLanguage;

  ngOnInit() {
    this.loadMovieData();
  }

  loadMovieData() {
    scrollToTop();
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      
      if (id) {
        this.isLoading = true;
        this.error = false;

        this.movieService.getMovieById(id).subscribe({
          next: (dbMovie) => {
            if (dbMovie) {
              this.movie = dbMovie;
              this.loadRelatedMovies(id, this.lang());
            } else {
              this.error = true;
            }
            this.isLoading = false;
          },
          error: () => {
            this.error = true;
            this.isLoading = false;
          }
        });
      }
    });
  }

  loadRelatedMovies(id: number, lang: string) {
    this.movieService.getMoviesWithSameGenre(id, 5).subscribe({
      next: (dbMovies) => {
        this.moviesWithSameGenre = dbMovies;
      }
    });
  }

  handleMovieClick(movie: Movie) {
    goToMovieDetail(movie, this.router);
  }

  getQuantityOfMovie() {
    return this.movie ? this.cartService.getQuantityForMovie(this.movie.movieId) : 1;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}