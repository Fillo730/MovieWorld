using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;


namespace MovieWorld.Services;

public class MovieService(IMovieRepository movieRepository, IMovieMapper movieMapper, IPagedMapper pageMapper,
    IStatisticsMapper statisticsMapper, IReviewsRepository reviewsRepository) : IMovieService
{
    private readonly IMovieRepository _movieRepository = movieRepository;

    private readonly IMovieMapper _movieMapper = movieMapper;

    private readonly IPagedMapper _pageMapper = pageMapper;

    private readonly IStatisticsMapper _statisticsMapper = statisticsMapper;

    private readonly IReviewsRepository _reviewsRepository = reviewsRepository;

    public async Task<PagedResult<MovieDto>> GetMoviesAsync(string lang, MovieFilterDto movieFilterDto, int? pageIndex = null, int? pageSize = null)
    {
        var (movies, totalCount) = await _movieRepository.GetAllMoviesAsync(movieFilterDto, pageIndex, pageSize);

        PagedResult<MovieDto> result;

        if(pageIndex == null || pageSize == null)
        {
            result = _pageMapper.MapToPagedResult(
            movies,
            totalCount,
            -1,
            -1,
            movie => _movieMapper.MapToDto(movie, lang));
        }
        else
        {
            result = _pageMapper.MapToPagedResult(
                movies,
                totalCount,
                pageIndex.Value,
                pageSize.Value,
                movie => _movieMapper.MapToDto(movie, lang));
        }

        await ApplyRatingSummaryAsync(result.Items);

        return result;
    }

    public async Task<MovieDto?> GetMovieByIdAsync(int id, string lang)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if(movie is null)
        {
            return null;
        }

        var movieDto = _movieMapper.MapToDto(movie, lang);

        await ApplyRatingSummaryAsync(new[] { movieDto });

        return movieDto;
    }

    private async Task ApplyRatingSummaryAsync(IEnumerable<MovieDto> movieDtos)
    {
        var movieIds = movieDtos.Select(m => m.MovieId).ToList();

        if (movieIds.Count == 0)
        {
            return;
        }

        var ratingSummaries = await _reviewsRepository.GetRatingSummaryForMoviesAsync(movieIds);
        var ratingsByMovieId = ratingSummaries.ToDictionary(r => r.MovieId, r => r);

        foreach (var movieDto in movieDtos)
        {
            if (ratingsByMovieId.TryGetValue(movieDto.MovieId, out var summary))
            {
                movieDto.AverageRating = Math.Round(summary.AverageRating, 1);
                movieDto.ReviewCount = summary.ReviewCount;
            }
        }
    }

    public async Task<bool> DeleteMovieAsync(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie is null)
        {
            return false;
        }

        _movieRepository.Delete(movie);

        await _movieRepository.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<MovieDto>> GetCultMoviesAsync(string lang, int limit)
    {
        var movies = await _movieRepository.GetCultMoviesAsync(limit);

        return _movieMapper.MapToDtoList(movies, lang);
    }

    public async Task<IEnumerable<MovieDto>> GetTopRatedMoviesAsync(string lang, int limit)
    {
        var movies = await _movieRepository.GetTopRatedMoviesAsync(limit);

        var movieDtos = _movieMapper.MapToDtoList(movies, lang).ToList();

        await ApplyRatingSummaryAsync(movieDtos);

        return movieDtos;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _movieRepository.GetCountAsync();
    }

    public async Task<IEnumerable<MovieDto>> GetMoviesWithSameGenre(int id, int quantity, string lang)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if(movie is null)
        {
            return Enumerable.Empty<MovieDto>();
        }

        var genreId = movie.MovieGenres.First().GenreId;

        var relatedMovies = await _movieRepository.GetMoviesByGenreIdAsync(genreId, id, quantity);

        return _movieMapper.MapToDtoList(relatedMovies, lang);
    }

    public async Task<MovieDto> CreateMovieAsync(MovieDto movieDto, string currentLang)
    {
        var movie = _movieMapper.MapToDb(movieDto, currentLang);

        await _movieRepository.AddAsync(movie);

        await _movieRepository.SaveChangesAsync();

        movieDto.MovieId = movie.MovieId;

        return movieDto;
    }

    public async Task<MovieDto?> UpdateMovieAsync(int id, MovieDto movieDto, string currentLang)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null) return null;

        _movieMapper.MapUpdateToDb(movieDto, movie, currentLang);

        await _movieRepository.SaveChangesAsync();

        return movieDto;
    }

    public async Task<IEnumerable<GenreDto>> GetGenresAsync(string lang)
    {
        var genres = await _movieRepository.GetGenresAsync(lang);

        return _movieMapper.MapGenreToDtoList(genres, lang);
    }

    public async Task<IEnumerable<FormatDto>> GetFormatsAsync()
    {
        var formats = await _movieRepository.GetFormatsAsync();

        return _movieMapper.MapFormatToDtoList(formats);
    }

    public async Task<IEnumerable<MovieDto>> GetMoviesByQueryAsync(string query, string lang, int limit)
    {
        var result = await _movieRepository.GetMoviesByQueryAsync(query, lang, limit);

        return _movieMapper.MapToDtoList(result, lang);
    }

    public async Task<int> GetCultMoviesCountAsync()
    {
        return await _movieRepository.GetCultMoviesCount();
    }

    public async Task<IEnumerable<GenreStatDto>> GetMoviesCountForEveryGenre(string lang)
    {
        var genreStatistics = await _movieRepository.GetMoviesCountForEveryGenre(lang);

        return _statisticsMapper.MapToGenreStatDtoList(genreStatistics);
    }

    public async Task<IEnumerable<GenreRevenueStatisticDto>> GetRevenuePerGenreAsync(string lang)
    {
        var genreRevenueStatistics = await _movieRepository.GetRevenuePerGenreAsync(lang);

        return _statisticsMapper.MapToGenreRevenueDtoList(genreRevenueStatistics);
    }
}
