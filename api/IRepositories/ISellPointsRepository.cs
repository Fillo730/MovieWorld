using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.Models;
using System.Threading.Tasks;

namespace MovieWorld.IRepositories;
public interface ISellPointsRepository
{
    Task<(IEnumerable<SellPoint>, int)> GetSellPointsAsync(SellPointsFilterDto filters, string lang, int? pageIndex = null, int? pageSize = null);

    Task<IEnumerable<SellPoint>> GetNearestSellPointsAsync(double userLat, double userLng, int limit, string lang);

    Task<(IEnumerable<SellPoint>, int)> GetSellPointsByMoviesAsync(IEnumerable<int> movieIds, int pageIndex, int pageSize, string lang, double? userLat, double? userLng);

    Task<IEnumerable<string>> GetCitiesAsync(string lang);

    Task<IEnumerable<SellPoint>> GetSellPointsByQuery(string query, string lang, int limit);
}

