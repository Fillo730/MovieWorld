import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { NewsFilterComponent } from '../../../components/news-filter/news-filter.component';
import { UpdateCreateNewsDialogComponent } from '../../../components/update-create-news-dialog/update-create-news-dialog.component';
import { NewsListMaterialComponent } from '../../../components/news-list-material/news-list-material.component';
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';

import { ToastService } from '../../../services/toast.service';
import { NewsService } from '../../../services/news.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { scrollToTop } from '../../../utils/windowFunctions';

import { News } from '../../../models/News.model';
import { NewsFilter, DEFAULT_NEWS_FILTER } from '../../../models/filters/NewsFilter';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    TranslatePipe,
    NewsFilterComponent,
    NewsListMaterialComponent,
    StateHandlerComponent,
  ],
  templateUrl: './news.html',
  styleUrl: './news.css'
})
export class NewsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private newsService = inject(NewsService);
  private languageService = inject(LanguageService);
  
  news: News[] = [];
  totalCount: number = 0;
  recentCount: number = 0;
  
  first: number = 0;
  rows: number = 10;
  totalRecords !: number;
  isLoading: boolean = false;
  error: boolean = false;

  public lang = this.languageService.currentLanguage;
  
  currentFilters: NewsFilter = { ...DEFAULT_NEWS_FILTER };

  ngOnInit(): void {
    this.loadNews();
    this.loadCounts();
  }

  loadNews(): void {
    this.isLoading = true;
    this.error = false;
    const pageIndex = Math.floor(this.first / this.rows);
    this.newsService.getNews(pageIndex, this.rows, this.currentFilters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.news = response.data.items;
          this.totalRecords = response.data.totalCount;
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

  loadCounts(): void {
    this.newsService.getCount().subscribe(response => {
      if(response.success) {
        this.totalCount = response.data;
      }
    })
  }

  handlePageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadNews();
    scrollToTop();
  }

  onFilterChanged(filters: NewsFilter) {
    this.currentFilters = filters;
    this.first = 0;
    this.loadNews();
  }

  resetFilters() {
    this.currentFilters = { ...DEFAULT_NEWS_FILTER };
    this.first = 0;
    this.loadNews();
    this.toastService.success(this.translate.instant('Admin.NewsPage.Messages.FiltersReset'));
  }

  deleteNews(newsId: number): void {
    const item = this.news.find(n => n.id === newsId);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('Admin.NewsPage.Dialog.DeleteTitle'),
        text: this.translate.instant('Admin.NewsPage.Dialog.DeleteConfirm', { title: item?.title }),
        cancelButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Delete'),
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newsService.deleteNews(newsId).subscribe(res => {
          if (res.success) {
            this.loadNews();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.NewsPage.Messages.DeleteSuccess'));
          } else {
            this.toastService.error(this.translate.instant('Admin.NewsPage.Messages.DeleteError'));
            console.log(res)
          }
        });
      }
    });
  }

  updateNews(newsId: number): void {
    const newsToEdit = this.news.find(n => n.id === newsId);
    const dialogRef = this.dialog.open(UpdateCreateNewsDialogComponent, {
      width: '600px',
      data: {
        title: this.translate.instant('Admin.NewsPage.Dialog.EditTitle'),
        cancelButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Edit'),
        news: { ...newsToEdit }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.newsService.updateNews(result).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.loadNews();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.NewsPage.Messages.UpdateSuccess'));
          } else {
            this.toastService.error(this.translate.instant('Admin.NewsPage.Messages.ErrorUpdate'))
          }
        });
      }
    });
  }

  addNews(): void {
    const dialogRef = this.dialog.open(UpdateCreateNewsDialogComponent, {
      width: '600px',
      data: {
        title: this.translate.instant('Admin.NewsPage.Dialog.AddTitle'),
        cancelButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.NewsPage.Buttons.Create'),
        news: { title: '', text: '', imagePath: '', date: new Date().toISOString(), relatedMovies: [], relatedActors: [] }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newsService.createNews(result).subscribe(res => {
          if (res.success) {
            this.loadNews();
            this.loadCounts();
            this.toastService.success(this.translate.instant('Admin.NewsPage.Messages.AddSuccess'));
          } else {
            this.toastService.error(this.translate.instant('Admin.NewsPage.Messages.AddError'));
          }
        });
      }
    });
  }
}