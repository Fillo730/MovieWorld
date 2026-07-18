using Microsoft.EntityFrameworkCore;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class WishlistRepository : BaseRepository, IWishlistRepository
{
    public WishlistRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {
    }

    public async Task<bool> ExistsAsync(int userId, int movieId)
    {
        return await _dbContext.Wishlists.AnyAsync(w => w.UserId == userId && w.MovieId == movieId);
    }

    public async Task<(IEnumerable<int> MovieIds, int TotalCount)> GetWishlistMovieIdsAsync(int userId, int pageIndex, int pageSize)
    {
        var query = _dbContext.Wishlists
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt);

        var totalCount = await query.CountAsync();

        var movieIds = await query
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .Select(w => w.MovieId)
            .ToListAsync();

        return (movieIds, totalCount);
    }

    public async Task<IEnumerable<int>> GetAllWishlistedMovieIdsAsync(int userId)
    {
        return await _dbContext.Wishlists
            .Where(w => w.UserId == userId)
            .Select(w => w.MovieId)
            .ToListAsync();
    }

    public async Task AddAsync(int userId, int movieId)
    {
        var exists = await ExistsAsync(userId, movieId);

        if (exists)
        {
            return;
        }

        await _dbContext.Wishlists.AddAsync(new Wishlist
        {
            UserId = userId,
            MovieId = movieId,
            CreatedAt = DateTime.UtcNow
        });
    }

    public async Task RemoveAsync(int userId, int movieId)
    {
        var item = await _dbContext.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.MovieId == movieId);

        if (item is not null)
        {
            _dbContext.Wishlists.Remove(item);
        }
    }
}
