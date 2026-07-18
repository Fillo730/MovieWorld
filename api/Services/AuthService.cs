using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class AuthService (IAuthRepository authRepository, IAuthMapper authMapper, ITokenService tokenService,
    IEmailService emailService, IConfiguration configuration): IAuthService
{
    private readonly IAuthRepository _authRepository = authRepository;

    private readonly IAuthMapper _authMapper = authMapper;

    private readonly ITokenService _tokenService = tokenService;

    private readonly IEmailService _emailService = emailService;

    private readonly IConfiguration _configuration = configuration;

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

    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _authRepository.GetUserAsync(email);

        if (user is null)
        {
            return;
        }

        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddHours(1);

        await _authRepository.SaveChangesAsync();

        var frontendBaseUrl = _configuration["Email:FrontendBaseUrl"] ?? "http://localhost:4200";
        var resetLink = $"{frontendBaseUrl}/reset-password?token={user.PasswordResetToken}";

        var body = $@"
            <div style=""font-family:sans-serif;max-width:500px;margin:0 auto;"">
                <h2>Reimposta la tua password</h2>
                <p>Ciao {user.Name}, abbiamo ricevuto una richiesta di reimpostazione della password per il tuo account MovieWorld.</p>
                <p><a href=""{resetLink}"" style=""display:inline-block;padding:10px 20px;background:#22c55e;color:#fff;text-decoration:none;border-radius:6px;"">Reimposta password</a></p>
                <p style=""color:#888;font-size:0.9em;"">Il link scade tra un'ora. Se non hai richiesto tu il reset, ignora questa email.</p>
            </div>";

        await _emailService.SendEmailAsync(user.Email, user.Name, "Reimposta la tua password - MovieWorld", body);
    }

    public async Task<(bool Success, string? Error)> ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _authRepository.GetUserByPasswordResetTokenAsync(token);

        if (user is null || user.PasswordResetTokenExpiresAt is null || user.PasswordResetTokenExpiresAt < DateTime.UtcNow)
        {
            return (false, "Link di reset non valido o scaduto.");
        }

        user.HashPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;

        await _authRepository.SaveChangesAsync();

        return (true, null);
    }
}
