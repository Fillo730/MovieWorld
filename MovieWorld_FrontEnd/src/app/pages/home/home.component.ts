import { Component, OnInit } from '@angular/core';
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
    StateHandlerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home implements OnInit {
  newsList: News[] = [];
  cultMovies: Movie[] = [];
  count: number = -1;
  imagesForCarosel: string[] = [];
  isModalVisible = false;
  clickedNews!: News;
  totalRecords: number = 0;
  rows: number = 2;
  first: number = 0;
  isLoading: boolean = true;
  error: boolean = false;

  constructor(
    private router: Router, 
    private themeService: ThemeService, 
    private movieService: MovieService, 
    private languageService: LanguageService, 
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    this.error = false;
    const currentLang = this.languageService.getLanguage();

    this.movieService.getCultMovies(currentLang, 8).subscribe({
      next: (moviesFromDb) => {
        this.cultMovies = moviesFromDb;
        this.imagesForCarosel = this.cultMovies.map(movie => movie.imagePath ?? "");
        
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

    this.loadNews();
  }

  loadNews() {
    const pageIndex = Math.floor(this.first / this.rows);
    const currentLang = this.languageService.getLanguage();
    this.newsService.getNews(pageIndex, this.rows, DEFAULT_NEWS_FILTER, currentLang).subscribe(response => {
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