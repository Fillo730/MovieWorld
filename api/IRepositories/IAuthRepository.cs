using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface IAuthRepository
{
    Task<User?> GetUserAsync(string email);

    Task<User?> GetUserByPasswordResetTokenAsync(string token);

    Task<User> CreateUserAsync(User user);

    Task SaveChangesAsync();
}
