using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IUsersMapper
{
    UserDto MapToDto(User user);

    IEnumerable<UserDto> MapToDtoList(IEnumerable<User> users);

    User MapToDb(UserDto userDto);

    IEnumerable<User> MapToDbList(IEnumerable<UserDto> users);

    void MapUpdateToDb(UserDto userDto, User user);
}
