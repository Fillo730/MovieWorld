import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ReviewsService } from '../../services/reviews.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';

import { UserReview } from '../../models/UserReview.model';
import { PagedResult } from '../../models/PagedResult';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { getValidImagePath, PathType } from '../../utils/validURLPath';

@Component({
  selector: 'my-reviews-component',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    RatingModule,
    PaginatorModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css',
})
export class MyReviewsComponent implements OnInit {
  private reviewsService = inject(ReviewsService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public reviews = signal<PagedResult<UserReview> | null>(null);
  public isLoading = signal<boolean>(false);

  public first = signal<number>(0);
  public rows = 5;

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading.set(true);
    const pageIndex = Math.floor(this.first() / this.rows);

    this.reviewsService.getMyReviews(pageIndex, this.rows).subscribe({
      next: (response) => {
        if (response.success) this.reviews.set(response.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rows = event.rows;
    this.loadReviews();
  }

  deleteReview(review: UserReview): void {
    this.reviewsService.deleteReview(review.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(this.translate.instant('Profile.MyReviews.DeleteSuccess'));
          this.loadReviews();
        } else {
          this.toastService.error(this.translate.instant('Profile.MyReviews.DeleteError'));
        }
      },
      error: () => this.toastService.error(this.translate.instant('Profile.MyReviews.DeleteError'))
    });
  }

  goToMovie(movieId: number): void {
    this.router.navigate(['/movie-detail', movieId]);
  }

  getAvatarImage(path: string | undefined): string {
    return getValidImagePath(path, PathType.movie);
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
