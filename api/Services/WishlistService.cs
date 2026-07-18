using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.IServices;

namespace MovieWorld.Services;

public class WishlistService(IWishlistRepository wishlistRepository, IMovieService movieService) : IWishlistService
{
    private readonly IWishlistRepository _wishlistRepository = wishlistRepository;

    private readonly IMovieService _movieService = movieService;

    public async Task<PagedResult<MovieDto>> GetWishlistAsync(int userId, int pageIndex, int pageSize, string lang)
    {
        var (movieIds, totalCount) = await _wishlistRepository.GetWishlistMovieIdsAsync(userId, pageIndex, pageSize);

        var movies = new List<MovieDto>();

        foreach (var movieId in movieIds)
        {
            var movie = await _movieService.GetMovieByIdAsync(movieId, lang);

            if (movie is not null)
            {
                movies.Add(movie);
            }
        }

        return new PagedResult<MovieDto>
        {
            Items = movies,
            TotalCount = totalCount,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }

    public async Task<IEnumerable<int>> GetWishlistedMovieIdsAsync(int userId)
    {
        return await _wishlistRepository.GetAllWishlistedMovieIdsAsync(userId);
    }

    public async Task AddToWishlistAsync(int userId, int movieId)
    {
        await _wishlistRepository.AddAsync(userId, movieId);
        await _wishlistRepository.SaveChangesAsync();
    }

    public async Task RemoveFromWishlistAsync(int userId, int movieId)
    {
        await _wishlistRepository.RemoveAsync(userId, movieId);
        await _wishlistRepository.SaveChangesAsync();
    }
}
