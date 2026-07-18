using Microsoft.EntityFrameworkCore;
using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class AuthRepository : BaseRepository, IAuthRepository
{
    public AuthRepository(TrainingBrattiContext context) : base(context)
    {

    }

    public async Task<User> CreateUserAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);

        return user;
    }

    public async Task<User?> GetUserAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<User?> GetUserByPasswordResetTokenAsync(string token)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
    }
}
