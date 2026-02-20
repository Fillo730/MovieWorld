using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface ICartRepository
{
    Task<Chart?> GetCartByUserIdAsync(int userId);
    Task<Chart?> AddOrUpdateItemAsync(int userId, int movieId, int quantity);
    Task<Chart?> RemoveItemAsync(int userId, int movieId);
    Task<Chart?> ClearCartAsync(int userId);
    Task<Chart?> CreateCartWithUserId(int userId);
    Task<Order> CreateOrderByUser(Order order);

    Task SaveChangesAsync();
}