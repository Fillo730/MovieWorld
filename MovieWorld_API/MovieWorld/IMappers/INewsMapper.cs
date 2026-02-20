using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface INewsMapper
{
    NewsDto MapToDto(News news, string lang);

    Task<News> MapToDb(NewsDto news, string lang);

    Task MapToUpdate(NewsDto newsDto, News newsDb, string lang);

    Task<IEnumerable<News>> MapToDbList(IEnumerable<NewsDto> news, string lang);

    IEnumerable<NewsDto> MapToDtoList(IEnumerable<News> newsList, string lang);
}
