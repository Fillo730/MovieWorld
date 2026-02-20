using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;
using System.Threading.Tasks;

namespace MovieWorld.Services;

public class OrdersService (IOrdersRepository ordersRepository, IOrdersMapper ordersMapper, IPagedMapper pagedMapper, IStatisticsMapper statisticMapper) : IOrdersService
{
    private readonly IOrdersRepository _ordersRepository = ordersRepository;

    private readonly IOrdersMapper _ordersMapper = ordersMapper;

    private readonly IPagedMapper _pagedMapper = pagedMapper;
    
    private readonly IStatisticsMapper _statisticsMapper = statisticMapper;

    public async Task<OrderDto> AddAsync(OrderDto order, string lang)
    {
        var orderDb = _ordersMapper.MapToDB(order);

        await _ordersRepository.AddAsync(orderDb);

        await _ordersRepository.SaveChangesAsync();

        var completeOrder = await _ordersRepository.GetByIdAsync(orderDb.OrderId);

        return _ordersMapper.MapToDto(completeOrder!, lang);
    }

    public async Task<bool> DeleteAsync(OrderDto order)
    {
        var orderDb = await _ordersRepository.GetByIdAsync(order.Id);

        if (orderDb == null)
        {
            return false;
        }

        orderDb.OrderStateId = 5;

        await _ordersRepository.SaveChangesAsync();

        return true;
    }

    public async Task<PagedResult<OrderDto>> GetAllOrdersAsync(int pageIndex, int pageSize, OrdersFilterDto filters, string lang)
    {
        (var orders, var totalCount) = await _ordersRepository.GetAllOrdersAsync(pageIndex, pageSize, filters, lang, null);

        return _pagedMapper.MapToPagedResult<Order, OrderDto>(orders, totalCount, pageIndex, pageSize, order => _ordersMapper.MapToDto(order, lang));
    }

    public async Task<IEnumerable<OrderStateDto>> GetAllOrderStatesAsync(string lang)
    {
        var orderStates =  await _ordersRepository.GetAllOrderStatesAsync(lang);

        return _ordersMapper.MapToListDto(orderStates, lang);
    }

    public async Task<OrderDto?> GetByIdAsync(int id, string lang)
    {
        var orderDb = await _ordersRepository.GetByIdAsync(id);

        if(orderDb is null)
        {
            return null;
        }

        return _ordersMapper.MapToDto(orderDb, lang);
    }

    public async Task<int> GetOrdersCompletedCountAsync()
    {
        var result = await _ordersRepository.GetOrdersCompletedCountAsync();

        return result;
    }

    public async Task<int> GetOrdersCountAsync()
    {
        var result = await _ordersRepository.GetOrdersCountAsync();

        return result;
    }

    public async Task<IEnumerable<OrdersPerOrderStateStatisticDto>> GetOrdersPerOrderStateAsync(string lang)
    {
        var result = await _ordersRepository.GetOrdersCountPerOrderStateAsync(lang);

        return _statisticsMapper.MapToOrdersPerOrderStateDtoList(result);
    }

    public async Task<IEnumerable<RevenuePerYearStatisticDto>> GetRevenueForEvertYearAsync()
    {
        var result = await _ordersRepository.GetReveueForEveryYearAsync();

        return _statisticsMapper.MapToRevenuePerYearDtoList(result);
    }

    public async Task<PagedResult<OrderDto>> GetUserOrdersAsync(int userId, int pageIndex, int pageSize, OrdersFilterDto filters, string lang)
    {
        var (order, totalCount) =  await _ordersRepository.GetAllOrdersAsync(pageIndex, pageSize, filters, lang, userId);

        return _pagedMapper.MapToPagedResult(order, totalCount, pageIndex, pageSize, o => _ordersMapper.MapToDto(o, lang));
    }

    public async Task<OrderDto?> UpdateAsync(OrderDto order, string lang)
    {
        var existingOrder = await _ordersRepository.GetByIdAsync(order.Id);

        if(existingOrder is null)
        {
            return null;
        }

        _ordersMapper.MapUpdateToDb(order, existingOrder);

        await _ordersRepository.SaveChangesAsync();

        return _ordersMapper.MapToDto(existingOrder, lang);
    }
}
