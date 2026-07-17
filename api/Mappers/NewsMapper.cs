using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.Models;
using MovieWorld.Repositories;
using System.Threading.Tasks;

namespace MovieWorld.Mappers;

public class NewsMapper(IPersonMapper personMapper, IMovieMapper movieMapper, IMovieRepository movieRepository, IPersonRepository personRepository) : INewsMapper
{
    private readonly IMovieMapper _movieMapper = movieMapper;

    private readonly IPersonMapper _personMapper = personMapper;

    private readonly IMovieRepository _movieRepository = movieRepository;

    private readonly IPersonRepository _personRepository = personRepository;
    public async Task<News> MapToDb(NewsDto news, string lang)
    {
        var newNews = new News
        {
            NewsId = news.Id,
            ImagePath = news.ImagePath,
            Date = DateOnly.FromDateTime(DateTime.Now),
            NewsTranslations = new List<NewsTranslation>
            {
                new NewsTranslation
                {
                    LanguageCode = lang,
                    Title = news.Title,
                    Text = news.Text,
                }
            }
        };

        foreach(var movieDto in news.RelatedMovies)
        {
            var existingMovie = await _movieRepository.GetByIdAsync(movieDto.MovieId);

            if (existingMovie != null) newNews.Movies.Add(existingMovie);
        }

        foreach(var personDto in news.RelatedActors)
        {
            var existingPersons = await _personRepository.GetPersonByIdAsync(personDto.PersonId);

            if (existingPersons != null) newNews.People.Add(existingPersons);
        }

        return newNews;
    }

    public async Task<IEnumerable<News>> MapToDbList(IEnumerable<NewsDto> news, string lang)
    {
        var result = new List<News>();

        foreach(var n in news)
        {
            result.Add(await MapToDb(n, lang));
        }

        return result;
    }

    public NewsDto MapToDto(News news, string lang)
    {
        return new NewsDto
        {
            Id = news.NewsId,
            ImagePath = news.ImagePath,
            Date = news.Date.ToString() ?? "",
            Title = news.NewsTranslations.Where(nt => nt.LanguageCode == lang).Select(nt => nt.Title).FirstOrDefault() ?? "",
            Text = news.NewsTranslations.Where(nt => nt.LanguageCode == lang).Select(nt => nt.Text).FirstOrDefault() ?? "",
            RelatedMovies = news.Movies.Select(m => _movieMapper.MapToDto(m, lang)).ToList(),
            RelatedActors = news.People.Select(p => _personMapper.MapToDto(p)).ToList(),
        };
    }

    public IEnumerable<NewsDto> MapToDtoList(IEnumerable<News> newsList, string lang)
    {
        var result = new List<NewsDto>();

        foreach (var news in newsList)
        {
            var dto = MapToDto(news, lang);
            result.Add(dto);
        }

        return result;
    }

    public async Task MapToUpdate(NewsDto newsDto, News newsDb, string lang)
    {
        newsDb.ImagePath = newsDto.ImagePath;

        newsDb.Movies.Clear();
        foreach (var movieDto in newsDto.RelatedMovies)
        {
            var movie = await _movieRepository.GetByIdAsync(movieDto.MovieId);
            if (movie != null) newsDb.Movies.Add(movie);
        }

        newsDb.People.Clear();
        foreach (var actorDto in newsDto.RelatedActors)
        {
            var person = await _personRepository.GetPersonByIdAsync(actorDto.PersonId);
            if (person != null) newsDb.People.Add(person);
        }

        var translation = newsDb.NewsTranslations.FirstOrDefault(nt => nt.LanguageCode == lang);
        if (translation != null)
        {
            translation.Title = newsDto.Title;
            translation.Text = newsDto.Text;
        }
        else
        {
            newsDb.NewsTranslations.Add(new NewsTranslation
            {
                LanguageCode = lang,
                Title = newsDto.Title,
                Text = newsDto.Text
            });
        }
    }
}