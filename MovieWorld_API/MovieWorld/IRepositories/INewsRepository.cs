using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;
public interface INewsRepository
{
    Task<(IEnumerable<News>, int totalCount)> GetAllNewsAsync(int pageIndex, int pageSize, NewsFilters filters, string lang);

    Task<News?> GetNewsByIdAsync(int id);

    Task<News> AddNewsAsync(News news);

    void DeleteNewsAsync(News news);

    Task<int> GetNewsCountAsync();

    Task SaveChangesAsync();
}

