using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class CartMapper(IMovieMapper movieMapper) : ICartMapper
{
    private readonly IMovieMapper _movieMapper = movieMapper;
    public ChartItem MapToChartItem(int cartId, int movieId, int quantity)
    {
        return new ChartItem
        {
            ChartId = cartId,
            MovieId = movieId,
            Quantità = quantity
        };
    }

    public CartDto? MapToDto(Chart? cart, string lang)
    {
        if (cart is null) return null;

        var dto = new CartDto
        {
            CartId = cart.ChartId,
            Items = cart.ChartItems?.Select(ci => new CartItemDto
            {
                Quantity = ci.Quantità ?? 0,
                Movie = ci.Movie != null ? _movieMapper.MapToDto(ci.Movie, lang) : null
            }).ToList() ?? new List<CartItemDto>()
        };

        dto.TotalPrice = dto.Items.Sum(item => (item.Movie?.Cost ?? 0) * item.Quantity);

        return dto;
    }
}
