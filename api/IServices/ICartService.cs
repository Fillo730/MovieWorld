using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface ICartService
{
    Task<CartDto?> GetCartAsync(int userId, string lang);
    Task<CartDto?> AddOrUpdateItemAsync(int userId, int movieId, int quantity, string lang);
    Task<CartDto?> RemoveItemAsync(int userId, int movieId, string lang);
    Task<CartDto?> ClearCartAsync(int userId, string lang);
    Task<OrderDto> AddUserOrderAsync(int userId, OrderUserRequest request, string lang);
}