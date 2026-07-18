using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController(IWishlistService wishlistService) : BaseController
{
    private readonly IWishlistService _wishlistService = wishlistService;

    [HttpGet]
    public async Task<IActionResult> GetWishlistAsync([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10, [FromQuery] string? lang = null)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var result = await _wishlistService.GetWishlistAsync(userId, pageIndex, pageSize, GetCurrentLanguage(lang));

            return Ok(ApiResponse<PagedResult<MovieDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<MovieDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("ids")]
    public async Task<IActionResult> GetWishlistedMovieIdsAsync()
    {
        try
        {
            var userId = GetUserIdFromToken();

            var result = await _wishlistService.GetWishlistedMovieIdsAsync(userId);

            return Ok(ApiResponse<IEnumerable<int>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<int>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpPost("{movieId}")]
    public async Task<IActionResult> AddToWishlistAsync(int movieId)
    {
        try
        {
            var userId = GetUserIdFromToken();

            await _wishlistService.AddToWishlistAsync(userId, movieId);

            return Ok(ApiResponse<string>.CreateSuccessResponse("Film aggiunto alla wishlist."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse($"Errore durante l'aggiunta alla wishlist: {ex.Message}"));
        }
    }

    [HttpDelete("{movieId}")]
    public async Task<IActionResult> RemoveFromWishlistAsync(int movieId)
    {
        try
        {
            var userId = GetUserIdFromToken();

            await _wishlistService.RemoveFromWishlistAsync(userId, movieId);

            return Ok(ApiResponse<string>.CreateSuccessResponse("Film rimosso dalla wishlist."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse($"Errore durante la rimozione dalla wishlist: {ex.Message}"));
        }
    }
}
