using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class UsersMapper : IUsersMapper
{
    public User MapToDb(UserDto userDto)
    {
        return new User
        {
            UserId = userDto.UserId,
            Email = userDto.Email,
            Name = userDto.Name,
            Surname = userDto.Surname,
            ImagePath = userDto.ImagePath,
            Role = userDto.Role,
            CreatedAt = userDto.CreatedAt ?? DateTime.UtcNow
        };
    }

    public IEnumerable<User> MapToDbList(IEnumerable<UserDto> users)
    {
        var result = new List<User>();

        foreach (var user in users)
        {
            result.Add(MapToDb(user));
        }

        return result;
    }

    public UserDto MapToDto(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            ImagePath = user.ImagePath,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            PreferredSellPointId = user.PreferredSellPointId,
            EmailNotificationsEnabled = user.EmailNotificationsEnabled
        };
    }

    public IEnumerable<UserDto> MapToDtoList(IEnumerable<User> users)
    {
        var result = new List<UserDto>();

        foreach (var user in users)
        {
            result.Add(MapToDto(user));
        }

        return result;
    }

    public void MapUpdateToDb(UserDto userDto, User user)
    {
        user.Name = userDto.Name;
        user.Surname = userDto.Surname;
        user.ImagePath = userDto.ImagePath;
        user.Role = userDto.Role;
        user.Email = userDto.Email;
    }

    public void MapProfileUpdateToDb(UpdateProfileDto profileDto, User user)
    {
        user.Name = profileDto.Name;
        user.Surname = profileDto.Surname;
        user.ImagePath = profileDto.ImagePath;
        user.PreferredSellPointId = profileDto.PreferredSellPointId;
        user.EmailNotificationsEnabled = profileDto.EmailNotificationsEnabled;
    }
}
