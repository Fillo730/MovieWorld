namespace MovieWorld.IRepositories;

public interface IWishlistRepository
{
    Task<bool> ExistsAsync(int userId, int movieId);

    Task<(IEnumerable<int> MovieIds, int TotalCount)> GetWishlistMovieIdsAsync(int userId, int pageIndex, int pageSize);

    Task<IEnumerable<int>> GetAllWishlistedMovieIdsAsync(int userId);

    Task AddAsync(int userId, int movieId);

    Task RemoveAsync(int userId, int movieId);

    Task SaveChangesAsync();
}
