using MovieWorld.Constants;

namespace MovieWorld.Dtos;
public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int Id { get; set; }

    public DateTime Expiration { get; set; }

    public UserRole Role { get; set; }

    public string ImagePath { get; set; } = AppConstants.DEFAULT_USER_IMAGE;
}

