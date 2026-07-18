using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController(IReviewsService reviewsService) : BaseController
{
    private readonly IReviewsService _reviewsService = reviewsService;

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetMovieReviewsAsync(int movieId, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _reviewsService.GetMovieReviewsAsync(movieId, pageIndex, pageSize);

            return Ok(ApiResponse<MovieReviewsSummaryDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<MovieReviewsSummaryDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyReviewsAsync([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 5, [FromQuery] string? lang = null)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var result = await _reviewsService.GetUserReviewsAsync(userId, pageIndex, pageSize, GetCurrentLanguage(lang));

            return Ok(ApiResponse<PagedResult<UserReviewDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<UserReviewDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("movie/{movieId}/mine")]
    public async Task<IActionResult> GetMyReviewAsync(int movieId)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var review = await _reviewsService.GetMyReviewAsync(movieId, userId);

            return Ok(ApiResponse<ReviewDto>.CreateSuccessResponse(review));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<ReviewDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize]
    [HttpPost("movie/{movieId}")]
    public async Task<IActionResult> UpsertReviewAsync(int movieId, [FromBody] CreateReviewDto request)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var (review, error) = await _reviewsService.UpsertReviewAsync(movieId, userId, request);

            if (review is null)
            {
                return Ok(ApiResponse<ReviewDto>.CreateFailureResponse(error ?? "Errore durante il salvataggio della recensione."));
            }

            return Ok(ApiResponse<ReviewDto>.CreateSuccessResponse(review));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<ReviewDto>.CreateFailureResponse($"Errore durante il salvataggio della recensione: {ex.Message}"));
        }
    }

    [Authorize]
    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> DeleteReviewAsync(int reviewId)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var isAdmin = User.IsInRole("Admin");

            var (success, error) = await _reviewsService.DeleteReviewAsync(reviewId, userId, isAdmin);

            if (!success)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse(error ?? "Errore durante l'eliminazione della recensione."));
            }

            return Ok(ApiResponse<string>.CreateSuccessResponse("Recensione eliminata con successo."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse($"Errore durante l'eliminazione della recensione: {ex.Message}"));
        }
    }
}
