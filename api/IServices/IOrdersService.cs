using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IServices;

public interface IOrdersService
{
    Task<PagedResult<OrderDto>> GetAllOrdersAsync(int pageIndex, int pageSize, OrdersFilterDto filters, string lang);
    Task<PagedResult<OrderDto>> GetUserOrdersAsync(int userId, int pageIndex, int pageSize, OrdersFilterDto filters, string lang);
    Task<OrderDto?> GetByIdAsync(int id, string lang);

    Task<IEnumerable<RevenuePerYearStatisticDto>> GetRevenueForEvertYearAsync();
    Task<OrderDto> AddAsync(OrderDto order, string lang);
    Task<IEnumerable<OrdersPerOrderStateStatisticDto>> GetOrdersPerOrderStateAsync(string lang);
    Task<OrderDto?> UpdateAsync(OrderDto order, string lang);
    Task<IEnumerable<OrderStateDto>> GetAllOrderStatesAsync(string lang);
    Task<bool> DeleteAsync(OrderDto order);

    Task<int> GetOrdersCountAsync();

    Task<int> GetOrdersCompletedCountAsync();
}
