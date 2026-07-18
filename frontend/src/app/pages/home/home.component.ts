import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Header } from "../../components/header/header.component";
import { Footer } from "../../components/footer/footer.component";
import { CaroselComponent } from "../../components/carosel/carosel.component";
import { NewsListComponent } from "../../components/news-list/news-list.component";
import { TitleTextWithImageSectionComponent } from '../../components/title-text-with-image-section/title-text-with-image-section.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { MovieService } from '../../services/movie.service';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/News.model';
import { Movie } from '../../models/Movie.model';
import { TranslatePipe } from '@ngx-translate/core';
import { scrollToTop } from '../../utils/windowFunctions';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { DEFAULT_NEWS_FILTER } from '../../models/filters/NewsFilter';
import { goToMovieDetail } from '../../utils/navigationFunctions';
import { ImageTitleCard } from '../../components/image-title-card/image-title-card.component';
import { RecentlyViewedService } from '../../services/recently-viewed.service';
import { RecentlyViewedItem } from '../../models/RecentlyViewedItem.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Header,
    Footer,
    CaroselComponent,
    NewsListComponent,
    ButtonModule,
    TitleTextWithImageSectionComponent,
    ModalComponent,
    TranslatePipe,
    StateHandlerComponent,
    ImageTitleCard
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly movieService = inject(MovieService);
  private readonly languageService = inject(LanguageService);
  private readonly newsService = inject(NewsService);
  private readonly recentlyViewedService = inject(RecentlyViewedService);

  newsList: News[] = [];
  cultMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  count: number = -1;
  isModalVisible = false;
  clickedNews!: News;
  totalRecords: number = 0;
  rows: number = 2;
  first: number = 0;
  isLoading: boolean = true;
  error: boolean = false;

  public lang = this.languageService.currentLanguage;
  public readonly recentlyViewed = this.recentlyViewedService.items;

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    this.error = false;

    this.movieService.getCultMovies(8).subscribe({
      next: (moviesFromDb) => {
        this.cultMovies = moviesFromDb;

        this.movieService.getMoviesCount().subscribe( response => {
          if(response.success) {
            this.count = response.data;
            this.isLoading = false;
          } else {
            this.count = 0;
            console.log(response);
            this.error = true;
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });

    this.loadTopRatedMovies();
    this.loadNews();
  }

  loadTopRatedMovies() {
    this.movieService.getTopRatedMovies().subscribe(moviesFromDb => {
      this.topRatedMovies = moviesFromDb;
    });
  }

  handleMovieClick(movie: Movie) {
    goToMovieDetail(movie, this.router);
  }

  handleRecentlyViewedClick(item: RecentlyViewedItem) {
    this.router.navigate(['movie-detail', item.movieId]);
    scrollToTop();
  }

  loadNews() {
    const pageIndex = Math.floor(this.first / this.rows);
    this.newsService.getNews(pageIndex, this.rows, DEFAULT_NEWS_FILTER).subscribe(response => {
      if(response.success) {
        this.newsList = response.data.items;
        this.totalRecords = response.data.totalCount;
      }
    });
  }

  handleGoToCatalog() {
    this.router.navigate(["/catalog"]);
    scrollToTop();
  }

  handleOpenModal(news: News) {
    this.clickedNews = news;
    this.isModalVisible = true;
  }

  handleCloseModal() {
    this.isModalVisible = false;
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadNews();
  }
}