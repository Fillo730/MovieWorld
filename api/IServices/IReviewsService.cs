using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface IReviewsService
{
    Task<MovieReviewsSummaryDto> GetMovieReviewsAsync(int movieId, int pageIndex, int pageSize);

    Task<PagedResult<UserReviewDto>> GetUserReviewsAsync(int userId, int pageIndex, int pageSize, string lang);

    Task<ReviewDto?> GetMyReviewAsync(int movieId, int userId);

    Task<(ReviewDto? Review, string? Error)> UpsertReviewAsync(int movieId, int userId, CreateReviewDto dto);

    Task<(bool Success, string? Error)> DeleteReviewAsync(int reviewId, int userId, bool isAdmin);
}
