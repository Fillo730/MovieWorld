using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;


namespace MovieWorld.Services;

public class MovieService(IMovieRepository movieRepository, IMovieMapper movieMapper, IPagedMapper pageMapper, 
    IStatisticsMapper statisticsMapper) : IMovieService
{
    private readonly IMovieRepository _movieRepository = movieRepository;

    private readonly IMovieMapper _movieMapper = movieMapper;

    private readonly IPagedMapper _pageMapper = pageMapper;

    private readonly IStatisticsMapper _statisticsMapper = statisticsMapper;

    public async Task<PagedResult<MovieDto>> GetMoviesAsync(string lang, MovieFilterDto movieFilterDto, int? pageIndex = null, int? pageSize = null)
    {
        var (movies, totalCount) = await _movieRepository.GetAllMoviesAsync(movieFilterDto, pageIndex, pageSize);

        if(pageIndex == null || pageSize == null)
        {
            return _pageMapper.MapToPagedResult(
            movies,
            totalCount,
            -1,
            -1,
            movie => _movieMapper.MapToDto(movie, lang));
        }

        return _pageMapper.MapToPagedResult(
            movies,
            totalCount,
            pageIndex.Value,
            pageSize.Value,
            movie => _movieMapper.MapToDto(movie, lang));
    }

    public async Task<MovieDto?> GetMovieByIdAsync(int id, string lang)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if(movie is null)
        {
            return null;
        }

        return _movieMapper.MapToDto(movie, lang);
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
}
