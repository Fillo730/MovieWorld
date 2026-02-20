using MovieWorld.Models;

namespace MovieWorld.IServices;

public interface ITokenService
{
    public string CreateToken(User user);
}
