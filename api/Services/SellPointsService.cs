using MovieWorld.Constants;
using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class SellPointsService(ISellPointsRepository sellPointsRepository, ISellPointsMapper sellPointsMapper, IPagedMapper pageMapper) : ISellPointsService
{
    private readonly ISellPointsRepository _sellPointsRepository = sellPointsRepository;

    private readonly ISellPointsMapper _sellPointsMapper = sellPointsMapper;

    private readonly IPagedMapper _pageMapper = pageMapper;

    public async Task<IEnumerable<string>> GetCitiesAsync(string lang)
    {
        return await _sellPointsRepository.GetCitiesAsync(lang);
    }

    public async Task<IEnumerable<SellPointDto>> GetNearestSellPointsAsync(double userLat, double userLng, int limit, string lang)
    {
        var sellPoints = await _sellPointsRepository.GetNearestSellPointsAsync(userLat, userLng, limit, lang);

        return _sellPointsMapper.MapToDtoList(sellPoints, lang, userLat, userLng);
    }

    public async Task<PagedResult<SellPointDto>> GetSellPointsAsync(SellPointsFilterDto filters, string? lang, int? pageIndex, int? pageSize)
    {
        var (sellPoints, totalCount) =  await _sellPointsRepository.GetSellPointsAsync(filters, lang ?? AppConstants.DefaultLanguage, pageIndex, pageSize);

        return _pageMapper.MapToPagedResult<SellPoint, SellPointDto>(
            sellPoints,
            totalCount,
            pageIndex ?? 0,
            pageSize ?? 0,
            sellPoint => _sellPointsMapper.MapToDto(sellPoint, lang));
    }

    public async Task<PagedResult<SellPointDto>> GetSellPointsByMoviesAsync(IEnumerable<int> movieIds, int pageIndex, int pageSize, string lang, double? userLat, double? userLng)
    {
        var (sellPoints, count) = await _sellPointsRepository.GetSellPointsByMoviesAsync(movieIds, pageIndex, pageSize, lang, userLat, userLng);

        return _pageMapper.MapToPagedResult(
            sellPoints,
            count,
            pageIndex,
            pageSize,
            sellPoint => _sellPointsMapper.MapToDto(sellPoint, lang, userLat, userLng));
    }

    public async Task<IEnumerable<SellPointDto>> GetSellPointsByQuery(string query, string lang, int limit)
    {
        var result = await _sellPointsRepository.GetSellPointsByQuery(query, lang, limit);

        return _sellPointsMapper.MapToDtoList(result, lang);
    }
}

