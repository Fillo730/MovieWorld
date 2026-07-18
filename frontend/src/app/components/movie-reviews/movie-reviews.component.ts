import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { AvatarModule } from 'primeng/avatar';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';

import { MovieReviewsSummary } from '../../models/MovieReviewsSummary.model';
import { Review } from '../../models/Review.model';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { getValidImagePath, PathType } from '../../utils/validURLPath';

@Component({
  selector: 'movie-reviews-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    TextareaModule,
    PaginatorModule,
    AvatarModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './movie-reviews.component.html',
  styleUrl: './movie-reviews.component.css',
})
export class MovieReviewsComponent implements OnInit, OnChanges {
  @Input() movieId!: number;

  private reviewsService = inject(ReviewsService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private themeService = inject(ThemeService);

  public summary = signal<MovieReviewsSummary | null>(null);
  public isLoading = signal<boolean>(false);

  public first = signal<number>(0);
  public rows = 5;

  public myReview = signal<Review | null>(null);
  public isEditing = signal<boolean>(false);
  public isSaving = signal<boolean>(false);
  public formRating = 0;
  public formComment = '';

  ngOnInit(): void {
    this.loadReviews();
    this.loadMyReview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieId'] && !changes['movieId'].firstChange) {
      this.first.set(0);
      this.isEditing.set(false);
      this.loadReviews();
      this.loadMyReview();
    }
  }

  loadReviews(): void {
    this.isLoading.set(true);
    const pageIndex = Math.floor(this.first() / this.rows);

    this.reviewsService.getMovieReviews(this.movieId, pageIndex, this.rows).subscribe({
      next: (response) => {
        if (response.success) this.summary.set(response.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadMyReview(): void {
    if (!this.isLoggedIn()) return;

    this.reviewsService.getMyReview(this.movieId).subscribe(response => {
      if (response.success) this.myReview.set(response.data);
    });
  }

  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rows = event.rows;
    this.loadReviews();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  startReview(): void {
    const existing = this.myReview();
    this.formRating = existing?.rating ?? 0;
    this.formComment = existing?.comment ?? '';
    this.isEditing.set(true);
  }

  cancelReview(): void {
    this.isEditing.set(false);
  }

  submitReview(): void {
    if (!this.formRating || this.formRating < 1) {
      this.toastService.error(this.translate.instant('MovieDetail.Reviews.RatingRequired'));
      return;
    }

    this.isSaving.set(true);

    this.reviewsService.upsertReview(this.movieId, this.formRating, this.formComment).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        if (response.success) {
          this.toastService.success(this.translate.instant('MovieDetail.Reviews.SaveSuccess'));
          this.isEditing.set(false);
          this.myReview.set(response.data);
          this.first.set(0);
          this.loadReviews();
        } else {
          this.toastService.error(this.translate.instant('MovieDetail.Reviews.SaveError'));
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.error(this.translate.instant('MovieDetail.Reviews.SaveError'));
      }
    });
  }

  deleteMyReview(): void {
    const review = this.myReview();
    if (!review) return;

    this.reviewsService.deleteReview(review.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(this.translate.instant('MovieDetail.Reviews.DeleteSuccess'));
          this.myReview.set(null);
          this.loadReviews();
        } else {
          this.toastService.error(this.translate.instant('MovieDetail.Reviews.DeleteError'));
        }
      },
      error: () => this.toastService.error(this.translate.instant('MovieDetail.Reviews.DeleteError'))
    });
  }

  getAvatarImage(path: string | undefined): string {
    return getValidImagePath(path, PathType.person);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
