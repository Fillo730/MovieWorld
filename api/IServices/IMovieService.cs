using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface IMovieService
{
    Task<PagedResult<MovieDto>> GetMoviesAsync(string lang, MovieFilterDto filters, int? pageIndex = null, int? pageSize = null);
    Task<IEnumerable<MovieDto>> GetMoviesWithSameGenre(int id, int quantity, string lang);
    Task<IEnumerable<GenreDto>> GetGenresAsync(string lang);
    Task<IEnumerable<FormatDto>> GetFormatsAsync();
    Task<IEnumerable<GenreStatDto>> GetMoviesCountForEveryGenre(string lang);
    Task<IEnumerable<GenreRevenueStatisticDto>> GetRevenuePerGenreAsync(string lang);
    Task<MovieDto?> GetMovieByIdAsync(int id, string lang);
    Task<IEnumerable<MovieDto>> GetCultMoviesAsync(string lang, int limit);
    Task<MovieDto> CreateMovieAsync(MovieDto movieDto, string lang);
    Task<MovieDto?> UpdateMovieAsync(int id, MovieDto movieDto,string lang);

    Task<IEnumerable<MovieDto>> GetMoviesByQueryAsync(string query, string lang, int limit);
    Task<int> GetTotalCountAsync();
    Task<int> GetCultMoviesCountAsync();
    Task<bool> DeleteMovieAsync(int id);
}