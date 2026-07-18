using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IServices;

public interface IUsersService
{
    Task<PagedResult<UserDto>> GetAllUsers(int pageIndex, int pageSize, UsersFilterDto filters);
    Task<UserDto?> GetUserByIdAsync(int userId);
    Task<IEnumerable<UserYearStatDto>> GetUsersCountForEveryYear();
    Task<IEnumerable<UserRevenueStatisticDto>> GetTopSpedingUsersAsync(int count);
    Task<IEnumerable<UserMonthStatisticDto>> GetUsersCountForMonthLastMonthsAsync(int months);
    Task<int> GetInactiveUsersCountAsync(int monthNumber);
    Task<decimal> GetOrdersPerUserRatioAsync();
    Task<IEnumerable<UserDto>> GetUserByQueryAsync(string query, int limit);
    public Task<UserDto> CreateUserAsync(UserDto user);
    Task<UserDto?> UpdateUserAsync(UserDto user);
    Task<UserDto?> UpdateOwnProfileAsync(int userId, UpdateProfileDto profile);
    Task<int> GetStandardUsersCountAsync();
    Task<int> GetAdminsCountAsync();

    Task<int> GetTotalUsersCountAsync();
    Task<bool> DeleteUserAsync(int userId);
}
