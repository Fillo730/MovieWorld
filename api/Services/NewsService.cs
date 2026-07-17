using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class NewsService (INewsRepository newsRepository, IPagedMapper pagedMapper, INewsMapper newsMapper) : INewsService
{
    private readonly INewsRepository _newsRepository = newsRepository;

    private readonly IPagedMapper _pagedMapper = pagedMapper;

    private readonly INewsMapper _newsMapper = newsMapper;

    public async Task<NewsDto> AddNewsAsync(NewsDto newNews, string lang)
    {
        var news = await _newsMapper.MapToDb(newNews, lang);

        await _newsRepository.AddNewsAsync(news);

        await _newsRepository.SaveChangesAsync();

        return _newsMapper.MapToDto(news, lang);
    }

    public async Task<NewsDto?> DeleteNewsAsync(int id, string lang)
    {
        var news = await _newsRepository.GetNewsByIdAsync(id);

        if(news is null)
        {
            return null;
        }

        _newsRepository.DeleteNewsAsync(news);

        await _newsRepository.SaveChangesAsync();

        return _newsMapper.MapToDto(news, lang);
    }

    public async Task<PagedResult<NewsDto>> GetNewsAsync(int pageIndex, int pageSize, NewsFilters filters, string lang)
    {
        var (news, totalCount) = await _newsRepository.GetAllNewsAsync(pageIndex, pageSize, filters, lang);

       return _pagedMapper.MapToPagedResult(news, totalCount, pageIndex, pageSize, news => _newsMapper.MapToDto(news, lang));
    }

    public async Task<NewsDto?> GetNewsByIdAsync(int id, string lang)
    {
        var news = await _newsRepository.GetNewsByIdAsync(id);

        if(news is null)
        {
            return null;
        }

        return _newsMapper.MapToDto(news, lang);
    }

    public async Task<int> GetNewsCountAsync()
    {
        return await _newsRepository.GetNewsCountAsync();
    }

    public async Task<NewsDto?> UpdateNewsAsync(NewsDto news, string lang)
    {
        var existingNews = await _newsRepository.GetNewsByIdAsync(news.Id);

        if(existingNews is null)
        {
            return null;
        }

        await _newsMapper.MapToUpdate(news, existingNews, lang);

        await _newsRepository.SaveChangesAsync();

        return _newsMapper.MapToDto(existingNews, lang);
    }
}
