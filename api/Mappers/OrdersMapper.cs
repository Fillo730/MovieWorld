using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class OrdersMapper (ISellPointsMapper sellPointsMapper, IMovieMapper movieMapper, IUsersMapper usersMapper) : IOrdersMapper
{
    private readonly ISellPointsMapper _sellPointsMapper = sellPointsMapper;

    private readonly IMovieMapper _movieMapper = movieMapper;

    private readonly IUsersMapper _usersMapper = usersMapper;
    public Order MapToDB(OrderDto orderDto)
    {
        return new Order
        {
            OrderId = orderDto.Id,
            UserId = orderDto.User.UserId,
            Date = orderDto.Id == 0 ? DateTime.UtcNow : orderDto.Date,
            SellPointId = orderDto.SellPoint.Id,
            OrderStateId = orderDto.State.Id,
            OrderItems = orderDto.Items?.Select(oi => new OrderItem
            {
                OrderId = orderDto.Id,
                MovieId = oi.Movie.MovieId,
                Quantity = oi.Quantity,
                PurchasedPrice = oi.Movie.Cost
            }).ToList()
        };
    }

    public OrderDto MapToDto(Order order, string lang)
    {
        return new OrderDto
        {
            Id = order.OrderId,
            Date = order.Date ?? DateTime.UtcNow,
            State = MapToDto(order.OrderState, lang),
            User = _usersMapper.MapToDto(order.User),
            SellPoint = _sellPointsMapper.MapToDto(order.SellPoint, lang),
            TotalAmount = order.OrderItems?.Sum(oi => oi.PurchasedPrice * oi.Quantity) ?? 0,
            Items = order.OrderItems?.Select(oi => new OrderItemDto
            {
                Quantity = oi.Quantity,
                Movie = _movieMapper.MapToDto(oi.Movie, lang),
                Price = oi.PurchasedPrice
            }).ToList() ?? new List<OrderItemDto>()
        };
    }

    public OrderStateDto MapToDto(OrderState orderState, string lang)
    {
        if (orderState == null) return new OrderStateDto { };
        return new OrderStateDto
        {
            Id = orderState.OrderStateId,
            Name = orderState.OrderStateTranslations
                        .FirstOrDefault()?.Description ?? string.Empty
        };
    }

    public IEnumerable<Order> MapToListDB(IEnumerable<OrderDto> orderDtos)
    {
        var orders = new List<Order>();

        foreach (var orderDto in orderDtos)
        {
            orders.Add(MapToDB(orderDto));
        }

        return orders;
    }

    public IEnumerable<OrderDto> MapToListDto(IEnumerable<Order> orders, string lang)
    {
        var orderDtos = new List<OrderDto>();

        foreach (var order in orders)
        {
            orderDtos.Add(MapToDto(order, lang));
        }

        return orderDtos;
    }

    public IEnumerable<OrderStateDto> MapToListDto(IEnumerable<OrderState> orderStates, string lang)
    {
        var orderStateDtos = new List<OrderStateDto>();

        foreach (var orderState in orderStates)
        {
            orderStateDtos.Add(MapToDto(orderState, lang));
        }

        return orderStateDtos;
    }

    public void MapUpdateToDb(OrderDto orderDto, Order order)
    {
        order.UserId = orderDto.User.UserId;
        order.SellPointId = orderDto.SellPoint.Id;
        order.OrderStateId = orderDto.State.Id;

        order.OrderItems.Clear();

        foreach (var orderMovie in orderDto.Items)
        {
            order.OrderItems.Add(new OrderItem
            {
                MovieId = orderMovie.Movie.MovieId,
                OrderId = order.OrderId,
                Quantity = orderMovie.Quantity,
                PurchasedPrice = orderMovie.Price,
            });
        }
    }

    public Order MapUserRequestToDb(OrderUserRequest request, int userId)
    {
        List<OrderItem> orderItems = request.Items.Select(i => new OrderItem
        {
            MovieId = i.Movie.MovieId,
            Quantity = i.Quantity,
            PurchasedPrice= i.Price,
            
        }).ToList();

        return new Order
        {
            UserId = userId,
            SellPointId = request.SellPointId,
            OrderStateId = request.OrderStateId,
            OrderItems = orderItems,
            Date = DateTime.Now,
        };
    }
}
