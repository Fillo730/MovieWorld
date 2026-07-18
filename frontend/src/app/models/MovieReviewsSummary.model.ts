import { PagedResult } from './PagedResult';
import { Review } from './Review.model';

export interface MovieReviewsSummary {
    averageRating: number;
    reviewCount: number;
    reviews: PagedResult<Review>;
}
