using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface IOrdersRepository
{
    Task<(IEnumerable<Order>, int)> GetAllOrdersAsync(int pageIndex, int pageSize, OrdersFilterDto filters, string lang, int? userId);

    Task<Order?> GetByIdAsync(int id);

    Task<IEnumerable<RevenuePerYearStatistic>> GetReveueForEveryYearAsync();

    Task<IEnumerable<OrdersPerOrderStateStatistic>> GetOrdersCountPerOrderStateAsync(string lang);

    Task<Order> AddAsync(Order order);

    Task<IEnumerable<OrderState>> GetAllOrderStatesAsync(string lang);

    void Delete(Order order);

    Task SaveChangesAsync();

    Task<int> GetOrdersCountAsync();

    Task<int> GetOrdersCompletedCountAsync();
}
