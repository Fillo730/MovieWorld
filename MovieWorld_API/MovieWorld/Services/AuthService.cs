using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class AuthService (IAuthRepository authRepository, IAuthMapper authMapper, ITokenService tokenService): IAuthService
{
    private readonly IAuthRepository _authRepository = authRepository;

    private readonly IAuthMapper _authMapper = authMapper;

    private readonly ITokenService _tokenService = tokenService;

    public async Task<LoginResponseDto?> AuthenticateUserAsync(LoginRequestDto request)
    {
        var user = await _authRepository.GetUserAsync(request.Email);

        if (user is null)
        {
            return null;
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.HashPassword);

        if (!isPasswordValid)
        {
            return null;
        }

        string token = _tokenService.CreateToken(user);
        return _authMapper.MapToDto(user, token);
    }

    public async Task<LoginResponseDto> RegisterUserAsync(RegisterRequestDto request)
    {
        var user = _authMapper.MapToDb(request);

        await _authRepository.CreateUserAsync(user);

        await _authRepository.SaveChangesAsync();

        string token = _tokenService.CreateToken(user);

        return _authMapper.MapToDto(user, token);
    }
}
