using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class ReviewsService(IReviewsRepository reviewsRepository, IReviewsMapper reviewsMapper) : IReviewsService
{
    private readonly IReviewsRepository _reviewsRepository = reviewsRepository;

    private readonly IReviewsMapper _reviewsMapper = reviewsMapper;

    public async Task<MovieReviewsSummaryDto> GetMovieReviewsAsync(int movieId, int pageIndex, int pageSize)
    {
        var (reviews, totalCount) = await _reviewsRepository.GetReviewsByMovieIdAsync(movieId, pageIndex, pageSize);
        var averageRating = await _reviewsRepository.GetAverageRatingByMovieIdAsync(movieId);
        var reviewsCount = await _reviewsRepository.GetReviewsCountByMovieIdAsync(movieId);

        return new MovieReviewsSummaryDto
        {
            AverageRating = Math.Round(averageRating, 1),
            ReviewCount = reviewsCount,
            Reviews = new PagedResult<ReviewDto>
            {
                Items = _reviewsMapper.MapToDtoList(reviews),
                TotalCount = totalCount,
                PageIndex = pageIndex,
                PageSize = pageSize
            }
        };
    }

    public async Task<PagedResult<UserReviewDto>> GetUserReviewsAsync(int userId, int pageIndex, int pageSize, string lang)
    {
        var (reviews, totalCount) = await _reviewsRepository.GetReviewsByUserIdAsync(userId, pageIndex, pageSize);

        return new PagedResult<UserReviewDto>
        {
            Items = _reviewsMapper.MapToUserReviewDtoList(reviews, lang),
            TotalCount = totalCount,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }

    public async Task<ReviewDto?> GetMyReviewAsync(int movieId, int userId)
    {
        var review = await _reviewsRepository.GetReviewByMovieAndUserAsync(movieId, userId);

        return review is null ? null : _reviewsMapper.MapToDto(review);
    }

    public async Task<(ReviewDto? Review, string? Error)> UpsertReviewAsync(int movieId, int userId, CreateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            return (null, "Il voto deve essere compreso tra 1 e 5.");
        }

        var existingReview = await _reviewsRepository.GetReviewByMovieAndUserAsync(movieId, userId);

        if (existingReview is not null)
        {
            existingReview.Rating = dto.Rating;
            existingReview.Comment = dto.Comment;

            await _reviewsRepository.SaveChangesAsync();

            return (_reviewsMapper.MapToDto(existingReview), null);
        }

        var review = new Review
        {
            MovieId = movieId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewsRepository.CreateReviewAsync(review);
        await _reviewsRepository.SaveChangesAsync();

        var createdReview = await _reviewsRepository.GetByIdAsync(review.ReviewId);

        return (_reviewsMapper.MapToDto(createdReview!), null);
    }

    public async Task<(bool Success, string? Error)> DeleteReviewAsync(int reviewId, int userId, bool isAdmin)
    {
        var review = await _reviewsRepository.GetByIdAsync(reviewId);

        if (review is null)
        {
            return (false, "Recensione non trovata.");
        }

        if (review.UserId != userId && !isAdmin)
        {
            return (false, "Non sei autorizzato a eliminare questa recensione.");
        }

        await _reviewsRepository.DeleteReviewAsync(review);
        await _reviewsRepository.SaveChangesAsync();

        return (true, null);
    }
}
