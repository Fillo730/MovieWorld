using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IServices;

public interface IAuthService
{
    Task<LoginResponseDto?> AuthenticateUserAsync(LoginRequestDto request);

    Task<LoginResponseDto> RegisterUserAsync(RegisterRequestDto request);
}
