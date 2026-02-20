using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IAuthMapper
{
    LoginResponseDto MapToDto(User user, string token);

    User MapToDb(RegisterRequestDto request);

}
