import { Component, OnInit } from '@angular/core';
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
import { AuthService } from '../../services/auth-service.service';
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
  movie!: Movie;
  moviesWithSameGenre: Movie[] = [];
  value = 0;
  isLoading: boolean = false;
  error: boolean = false;

  constructor(
    private cartService: CartService, 
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private languageService: LanguageService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadMovieData();
  }

  loadMovieData() {
    scrollToTop();
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const currentLang = this.languageService.getLanguage();
      
      if (id) {
        this.isLoading = true;
        this.error = false;

        this.movieService.getMovieById(id, currentLang).subscribe({
          next: (dbMovie) => {
            if (dbMovie) {
              this.movie = dbMovie;
              this.loadRelatedMovies(id, currentLang);
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
    this.movieService.getMoviesWithSameGenre(id, lang, 5).subscribe({
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