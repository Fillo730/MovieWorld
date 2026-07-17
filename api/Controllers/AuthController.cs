using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : BaseController
{
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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await authService.RegisterUserAsync(request);

        return Ok(ApiResponse<LoginResponseDto>.CreateSuccessResponse(result));
    }
}