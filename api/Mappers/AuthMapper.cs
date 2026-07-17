using MovieWorld.Constants;
using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class AuthMapper : IAuthMapper
{
    public User MapToDb(RegisterRequestDto request)
    {
        return new User
        {
            Email = request.Email,
            HashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = 0,
            Name = request.FirstName,
            Surname = request.LastName,
            CreatedAt = DateTime.UtcNow,
        };
    }

    public LoginResponseDto MapToDto(User user, string token)
    {
        return new LoginResponseDto
        {
            Token = token,
            Email = user.Email,
            Name = user.Name,
            Id = user.UserId,
            Expiration = DateTime.UtcNow.AddHours(2),
            Role = user.Role == 1 ? UserRole.Admin : UserRole.User,
            ImagePath = user.ImagePath,
        };
    }
}