

using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface INewsService
{
    Task<PagedResult<NewsDto>> GetNewsAsync(int pageIndex, int pageSize, NewsFilters filters,  string lang);

    Task<NewsDto?> GetNewsByIdAsync(int id, string lang);

    Task<NewsDto> AddNewsAsync(NewsDto newNews, string lang);

    Task<NewsDto?> UpdateNewsAsync(NewsDto newNews, string lang);

    Task<NewsDto?> DeleteNewsAsync(int id, string lang);

    Task<int> GetNewsCountAsync();
}

