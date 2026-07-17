using Microsoft.EntityFrameworkCore;
using MovieWorld.Constants;
using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class UsersRepository : BaseRepository, IUserRepository
{
    public UsersRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {

    }

    public async Task<User> CreateUserAsync(User user)
    {
        if (user.CreatedAt == default)
        {
            user.CreatedAt = DateTime.UtcNow;
        }

        await _dbContext.Users.AddAsync(user);
        return user;
    }

    public async Task DeleteUserAsync(User user)
    {
        _dbContext.Users.Remove(user);
    }

    public async Task<(IEnumerable<User> users, int totalCount)> GetAllUsers(int pageIndex, int pageSize, UsersFilterDto filters)
    {
        var query = _dbContext.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            var pattern = $"%{filters.Query}%";
            query = query.Where(u => EF.Functions.Like(u.Name, pattern) ||
                                     EF.Functions.Like(u.Surname, pattern) ||
                                     EF.Functions.Like(u.Email, pattern));
        }

        if (filters.Role != -1)
        {
            query = query.Where(u => u.Role == filters.Role);
        }

        if (filters.Year > 0)
        {
            query = query.Where(u => u.CreatedAt.Year == filters.Year);
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (users, totalCount);
    }

    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<int> GetStandardUsersCountAsync()
    {
        return await _dbContext.Users.CountAsync(u => u.Role == 0);
    }

    public async Task<int> GetAdminsCountAsync()
    {
        return await _dbContext.Users.CountAsync(u => u.Role == 1);
    }

    public async Task<IEnumerable<User>> GetUserByQueryAsync(string query, int limit)
    {
        var pattern = $"%{query}%";
        return await _dbContext.Users
            .AsNoTracking()
            .Where(u => EF.Functions.Like(u.Name, pattern) ||
                        EF.Functions.Like(u.Surname, pattern) ||
                        EF.Functions.Like(u.Email, pattern))
            .Take(limit)
            .ToListAsync();
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _dbContext.Users.CountAsync();
    }

    public async Task<IEnumerable<UserYearStatistic>> GetUsersCountForYearAsync()
    {
        return await _dbContext.Users
            .GroupBy(u => u.CreatedAt.Year)
            .Select(g => new UserYearStatistic
            {
                Year = g.Key,
                Count = g.Count()
            })
            .OrderBy(u => u.Year)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserRevenueStatistic>> GetTopSpedingUsersAsync(int count)
    {
        return await _dbContext.Users
            .Select(u => new UserRevenueStatistic
            {
                User = u,
                Revenue = u.Orders
                    .Where(o => o.OrderStateId != (int)OrderStateEnum.Deleted)
                    .SelectMany(o => o.OrderItems)
                    .Sum(oi => oi.Quantity * oi.PurchasedPrice)
            })
            .OrderByDescending(u => u.Revenue)
            .Take(count)
            .ToListAsync();
    }

    public async Task<int> GetInactiveUsersCountAsync(int monthNumber)
    {
        DateTime tresholdDate = DateTime.Now.AddMonths(-monthNumber);
        return await _dbContext.Users
            .Where(u => !u.Orders.Any(o => o.Date >= tresholdDate && o.OrderStateId != (int)OrderStateEnum.Deleted))
            .CountAsync();
    }

    public async Task<IEnumerable<UserMonthStatistic>> GetUsersCountForMonthLastMonthsAsync(int months)
    {
        var today = DateTime.UtcNow;
        var startDate = new DateTime(today.Year, today.Month, 1).AddMonths(-months);
        return await _dbContext.Users
            .Where(u => u.CreatedAt >= startDate)
            .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month})
            .Select(g => new UserMonthStatistic
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Count = g.Count()
            })
            .OrderBy(s => s.Year).ThenBy(s => s.Month)
            .ToListAsync();
    }

    public async Task<decimal> GetOrdersPerUserRatioAsync()
    {
        var totalUsers = await _dbContext.Users.CountAsync();

        if(totalUsers == 0)
        {
            return 0;
        }

        var totalOrders = await _dbContext.Orders
            .Where(o => o.OrderStateId != (int)OrderStateEnum.Deleted)
            .CountAsync();

        return (decimal) totalOrders / totalUsers;
    }
}