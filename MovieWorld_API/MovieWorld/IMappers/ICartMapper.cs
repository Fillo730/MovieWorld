using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface ICartMapper
{
    ChartItem MapToChartItem(int cartId, int movieId, int quantity);

    CartDto? MapToDto(Chart? cart, string lang);
}
