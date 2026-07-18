using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface IReviewsRepository
{
    Task<(IEnumerable<Review> Reviews, int TotalCount)> GetReviewsByMovieIdAsync(int movieId, int pageIndex, int pageSize);

    Task<(IEnumerable<Review> Reviews, int TotalCount)> GetReviewsByUserIdAsync(int userId, int pageIndex, int pageSize);

    Task<double> GetAverageRatingByMovieIdAsync(int movieId);

    Task<IEnumerable<MovieRatingSummary>> GetRatingSummaryForMoviesAsync(IEnumerable<int> movieIds);

    Task<int> GetReviewsCountByMovieIdAsync(int movieId);

    Task<Review?> GetReviewByMovieAndUserAsync(int movieId, int userId);

    Task<Review?> GetByIdAsync(int reviewId);

    Task<Review> CreateReviewAsync(Review review);

    Task DeleteReviewAsync(Review review);

    Task SaveChangesAsync();
}
