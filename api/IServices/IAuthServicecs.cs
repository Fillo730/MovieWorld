using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IServices;

public interface IAuthService
{
    Task<LoginResponseDto?> AuthenticateUserAsync(LoginRequestDto request);

    Task<LoginResponseDto> RegisterUserAsync(RegisterRequestDto request);

    Task ForgotPasswordAsync(string email);

    Task<(bool Success, string? Error)> ResetPasswordAsync(string token, string newPassword);
}
