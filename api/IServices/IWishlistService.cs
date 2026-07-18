using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface IWishlistService
{
    Task<PagedResult<MovieDto>> GetWishlistAsync(int userId, int pageIndex, int pageSize, string lang);

    Task<IEnumerable<int>> GetWishlistedMovieIdsAsync(int userId);

    Task AddToWishlistAsync(int userId, int movieId);

    Task RemoveFromWishlistAsync(int userId, int movieId);
}
