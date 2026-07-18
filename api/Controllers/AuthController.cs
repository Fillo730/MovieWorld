using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MovieWorld.Dtos;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : BaseController
{
    [EnableRateLimiting("auth")]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await authService.AuthenticateUserAsync(request);

        if (result == null)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse("Email or password are not correct"));
        }

        return Ok(ApiResponse<LoginResponseDto>.CreateSuccessResponse(result));
    }

    [EnableRateLimiting("auth")]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await authService.RegisterUserAsync(request);

        return Ok(ApiResponse<LoginResponseDto>.CreateSuccessResponse(result));
    }

    [EnableRateLimiting("auth")]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
    {
        await authService.ForgotPasswordAsync(request.Email);

        return Ok(ApiResponse<string>.CreateSuccessResponse("Se l'indirizzo esiste, riceverai un'email con le istruzioni per il reset."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
    {
        var (success, error) = await authService.ResetPasswordAsync(request.Token, request.NewPassword);

        if (!success)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(error ?? "Errore durante il reset della password."));
        }

        return Ok(ApiResponse<string>.CreateSuccessResponse("Password reimpostata con successo."));
    }
}