using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;
using Microsoft.EntityFrameworkCore;
using MovieWorld.Constants;

namespace MovieWorld.Repositories;

public class OrdersRepository  : BaseRepository, IOrdersRepository
{
    public OrdersRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {

    }

    public async Task<Order> AddAsync(Order order)
    {
        await _dbContext.Orders.AddAsync(order);

        return order;
    }

    public void Delete(Order order)
    {
        _dbContext.Orders.Remove(order);
    }

    public async Task<(IEnumerable<Order>, int)> GetAllOrdersAsync(int pageIndex, int pageSize, OrdersFilterDto filters, string lang, int? userId = null)
    {
        var query = _dbContext.Orders.AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(o => o.UserId == userId.Value);
        }

        if (filters.Year > 0)
        {
            query = query.Where(o => o.Date.HasValue && o.Date.Value.Year == filters.Year);
        }

        if (filters.OrderStateId > 0)
        {
            query = query.Where(o => o.OrderStateId == filters.OrderStateId);
        }

        if (filters.MoviesNumber > 0)
        {
            query = query.Where(o => o.OrderItems.Sum(oi => oi.Quantity) == filters.MoviesNumber);
        }

        // SQLite/EF Core non supporta Sum() su decimal: si effettua il cast a double,
        // che SQLite può sommare nativamente (affinità REAL).
        if (filters.MaxTotalPrice > 0)
        {
            query = query.Where(o => o.OrderItems.Sum(oi => (double)(oi.Quantity * oi.PurchasedPrice)) <= filters.MaxTotalPrice);
        }

        if (filters.MinTotalPrice > 0)
        {
            query = query.Where(o => o.OrderItems.Sum(oi => (double)(oi.Quantity * oi.PurchasedPrice)) >= filters.MinTotalPrice);
        }

        var totalItems = await query.CountAsync();

        var orders = await query
            .AsNoTracking()
            .Include(o => o.OrderState)
                .ThenInclude(os => os.OrderStateTranslations.Where(t => t.LanguageCode == lang))
            .Include(o => o.User)
            .Include(o => o.SellPoint)
                .ThenInclude(o => o.SellPointTranslations)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Movie)
                .ThenInclude(o => o.MovieTranslations)
            .OrderByDescending(o => o.Date)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (orders, totalItems);
    }

    public async Task<IEnumerable<OrderState>> GetAllOrderStatesAsync(string lang)
    {
        var result = await _dbContext.OrderStates
            .AsNoTracking()
            .Include(os => os.OrderStateTranslations.Where(t => t.LanguageCode == lang))
            .ToListAsync();

        return result;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        var order = await _dbContext.Orders
            .Include(o => o.User)
            .Include(o => o.SellPoint).ThenInclude(o => o.SellPointTranslations)
            .Include(o => o.OrderState).ThenInclude(o => o.OrderStateTranslations)
            .Include(o => o.OrderItems).ThenInclude(ot => ot.Movie).ThenInclude(o => o.MovieTranslations)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        return order;
    }

    public async Task<int> GetOrdersCompletedCountAsync()
    {
        return await _dbContext.Orders.Where(order => order.OrderStateId == 3).CountAsync();
    }

    public async Task<int> GetOrdersCountAsync()
    {
        return await _dbContext.Orders.CountAsync();
    }

    public async Task<IEnumerable<OrdersPerOrderStateStatistic>> GetOrdersCountPerOrderStateAsync(string lang)
    {
        return await _dbContext.OrderStates
            .Select(os => new OrdersPerOrderStateStatistic
            {
                OrderStateName = os.OrderStateTranslations
                    .Where(ost => ost.LanguageCode == lang)
                    .Select(ost => ost.Description)
                    .FirstOrDefault() ?? "Unknown",
                OrderCount = os.Orders.Count()
            })
            .OrderBy(s => s.OrderStateName)
            .ToListAsync();
    }

    public async Task<IEnumerable<RevenuePerYearStatistic>> GetReveueForEveryYearAsync()
    {
        return await _dbContext.Orders
            .Where(o => o.OrderStateId != (int)OrderStateEnum.Deleted)
            .GroupBy(o => o.Date.Value.Year)
            .Select(g => new RevenuePerYearStatistic
            {
                Year = g.Key,
                Revenue = (decimal)g.SelectMany(o => o.OrderItems)
                           .Sum(oi => (double)(oi.Quantity * oi.PurchasedPrice))
            })
            .OrderBy(r => r.Year)
            .ToListAsync();
    }
}
