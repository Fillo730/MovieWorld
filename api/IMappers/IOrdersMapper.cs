using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IOrdersMapper
{
    OrderDto MapToDto(Order order, string lang);

    IEnumerable<OrderDto> MapToListDto(IEnumerable<Order> orders, string lang);

    Order MapToDB(OrderDto orderDto);

    IEnumerable<Order> MapToListDB(IEnumerable<OrderDto> orderDtos);

    Order MapUserRequestToDb(OrderUserRequest request, int userId);

    OrderStateDto MapToDto(OrderState orderState, string lang);

    IEnumerable<OrderStateDto> MapToListDto(IEnumerable<OrderState> orderStates, string lang);

    void MapUpdateToDb(OrderDto orderDto, Order order);
}
