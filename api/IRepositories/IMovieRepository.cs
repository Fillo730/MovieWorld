using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface IMovieRepository
{
    Task<(IEnumerable<Movie> Movies, int TotalCount)> GetAllMoviesAsync(MovieFilterDto filters, int? pageIndex, int? pageSize);
    Task<IEnumerable<Movie>> GetMoviesByGenreIdAsync(int genreId, int movieId, int quantity);
    Task<IEnumerable<GenreTranslation>> GetGenresAsync(string lang);
    Task<IEnumerable<GenreStatistics>> GetMoviesCountForEveryGenre(string lang);

    Task<IEnumerable<GenreRevenueStatistic>> GetRevenuePerGenreAsync(string lang);
    Task<IEnumerable<Format>> GetFormatsAsync();
    Task<IEnumerable<Movie>> GetCultMoviesAsync(int limit);
    Task<Movie?> GetByIdAsync(int id);
    Task<int> GetCountAsync();
    Task<Movie>AddAsync(Movie movie);
    Task<IEnumerable<Movie>> GetMoviesByQueryAsync(string query, string lang, int limit);
    void Delete(Movie movie);
    Task<int> GetCultMoviesCount();
    Task SaveChangesAsync();
}