using Microsoft.EntityFrameworkCore;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class ReviewsRepository : BaseRepository, IReviewsRepository
{
    public ReviewsRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {
    }

    public async Task<(IEnumerable<Review> Reviews, int TotalCount)> GetReviewsByMovieIdAsync(int movieId, int pageIndex, int pageSize)
    {
        var query = _dbContext.Reviews
            .Include(r => r.User)
            .Where(r => r.MovieId == movieId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();

        var reviews = await query
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<(IEnumerable<Review> Reviews, int TotalCount)> GetReviewsByUserIdAsync(int userId, int pageIndex, int pageSize)
    {
        var query = _dbContext.Reviews
            .Include(r => r.Movie)
                .ThenInclude(m => m.MovieTranslations)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();

        var reviews = await query
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<double> GetAverageRatingByMovieIdAsync(int movieId)
    {
        var ratings = await _dbContext.Reviews
            .Where(r => r.MovieId == movieId)
            .Select(r => r.Rating)
            .ToListAsync();

        return ratings.Count == 0 ? 0 : ratings.Average();
    }

    public async Task<IEnumerable<MovieRatingSummary>> GetRatingSummaryForMoviesAsync(IEnumerable<int> movieIds)
    {
        return await _dbContext.Reviews
            .Where(r => movieIds.Contains(r.MovieId))
            .GroupBy(r => r.MovieId)
            .Select(g => new MovieRatingSummary
            {
                MovieId = g.Key,
                AverageRating = g.Average(r => r.Rating),
                ReviewCount = g.Count()
            })
            .ToListAsync();
    }

    public async Task<int> GetReviewsCountByMovieIdAsync(int movieId)
    {
        return await _dbContext.Reviews.CountAsync(r => r.MovieId == movieId);
    }

    public async Task<Review?> GetReviewByMovieAndUserAsync(int movieId, int userId)
    {
        return await _dbContext.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == userId);
    }

    public async Task<Review?> GetByIdAsync(int reviewId)
    {
        return await _dbContext.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
    }

    public async Task<Review> CreateReviewAsync(Review review)
    {
        await _dbContext.Reviews.AddAsync(review);

        return review;
    }

    public async Task DeleteReviewAsync(Review review)
    {
        _dbContext.Reviews.Remove(review);

        await Task.CompletedTask;
    }
}
