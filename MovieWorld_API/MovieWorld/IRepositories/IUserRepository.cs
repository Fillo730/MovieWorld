using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface IUserRepository
{
    Task<(IEnumerable<User> users, int totalCount)> GetAllUsers(int pageIndex, int pageSize, UsersFilterDto filters);

    Task<User?> GetUserByIdAsync(int userId);

    Task<IEnumerable<UserYearStatistic>> GetUsersCountForYearAsync();

    Task<IEnumerable<UserMonthStatistic>> GetUsersCountForMonthLastMonthsAsync(int months);

    Task<decimal> GetOrdersPerUserRatioAsync();

    Task<IEnumerable<UserRevenueStatistic>> GetTopSpedingUsersAsync(int count);

    Task<int> GetInactiveUsersCountAsync(int monthNumber);

    Task<IEnumerable<User>> GetUserByQueryAsync(string query, int limit);

    public Task<User> CreateUserAsync(User user);

    Task DeleteUserAsync(User user);

    Task<int> GetStandardUsersCountAsync();
    
    Task<int> GetAdminsCountAsync();

    Task<int> GetTotalUsersCountAsync();

    Task SaveChangesAsync();
}
