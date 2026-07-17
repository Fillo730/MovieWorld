using Microsoft.AspNetCore.Components.Web.Virtualization;
using Microsoft.EntityFrameworkCore;
using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class CartRepository : BaseRepository, ICartRepository
{
    private readonly ICartMapper _cartMapper;

    public CartRepository(TrainingBrattiContext dbContext, ICartMapper cartMapper) : base(dbContext)
    {
        _cartMapper = cartMapper;
    }

    public async Task<Chart?> GetCartByUserIdAsync(int userId)
    {
        var cart = await _dbContext.Charts
        .Include(c => c.ChartItems)
            .ThenInclude(ci => ci.Movie)
                .ThenInclude(m => m.MovieTranslations)
        .Include(c => c.ChartItems)
            .ThenInclude(ci => ci.Movie)
                .ThenInclude(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                        .ThenInclude(g => g.GenreTranslations)
        .Include(c => c.ChartItems)
            .ThenInclude(ci => ci.Movie)
                .ThenInclude(m => m.Format)
        .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart is null)
        {
            return await CreateCartWithUserId(userId);
        }
        else
        {
            return cart;
        }
    }

    public async Task<Chart?> AddOrUpdateItemAsync(int userId, int movieId, int quantity)
    {
        var cart = await GetCartByUserIdAsync(userId);

        if (cart == null) return null;

        var cartItem = cart.ChartItems.FirstOrDefault(ci => ci.MovieId == movieId);

        if (cartItem is null)
        {
            var newCartItem = _cartMapper.MapToChartItem(cart.ChartId, movieId, quantity);
            await _dbContext.ChartItems.AddAsync(newCartItem);
        }
        else
        {
            cartItem.Quantità = quantity;
        }

        await _dbContext.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<Chart?> RemoveItemAsync(int userId, int movieId)
    {
        await _dbContext.ChartItems
            .Where(ci => ci.Chart.UserId == userId && ci.MovieId == movieId)
            .ExecuteDeleteAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<Chart?> ClearCartAsync(int userId)
    {
        await _dbContext.ChartItems
            .Where(ci => ci.Chart.UserId == userId)
            .ExecuteDeleteAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<Chart?> CreateCartWithUserId(int userId)
    {
        await _dbContext.Charts.AddAsync(new Chart
        {
            UserId = userId,
        });
        await _dbContext.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<Order> CreateOrderByUser(Order order)
    {
        await _dbContext.Orders.AddAsync(order);

        return order;
    }
}