using MovieWorld.Dtos;
using MovieWorld.DTOs;

namespace MovieWorld.IServices;

public interface ISellPointsService
{
    Task<PagedResult<SellPointDto>> GetSellPointsAsync(SellPointsFilterDto filters, string? lang, int? pageIndex = null, int? pageSize = null);

    Task<IEnumerable<string>> GetCitiesAsync(string lang);  

    Task<IEnumerable<SellPointDto>> GetNearestSellPointsAsync(double userLat, double userLng, int limit, string lang);

    Task<PagedResult<SellPointDto>> GetSellPointsByMoviesAsync(IEnumerable<int> movieIds, int pageIndex, int pageSize, string lang, double? userLat, double? userLng);

    Task<IEnumerable<SellPointDto>> GetSellPointsByQuery(string query, string lang, int limit);
}
