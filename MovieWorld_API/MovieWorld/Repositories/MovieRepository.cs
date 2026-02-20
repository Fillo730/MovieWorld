using MovieWorld.Models;
using MovieWorld.IRepositories;
using Microsoft.EntityFrameworkCore;
using MovieWorld.Dtos;
using MovieWorld.Constants;

namespace MovieWorld.Repositories;

public class MovieRepository : BaseRepository, IMovieRepository
{
    public MovieRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {
    }

    public async Task<(IEnumerable<Movie> Movies, int TotalCount)> GetAllMoviesAsync(MovieFilterDto movieFilterDto, int? pageIndex = null, int? pageSize = null)
    {
        var query = _dbContext.Movies.AsQueryable();

        if (!string.IsNullOrEmpty(movieFilterDto.Name))
        {
            query = query.Where(m => m.MovieTranslations.Any(mt => mt.Title.Contains(movieFilterDto.Name)));
        }

        if (!string.IsNullOrEmpty(movieFilterDto.Genre))
        {
            query = query.Where(m => m.MovieGenres.Any(mg =>
                mg.Genre.GenreTranslations.Any(gt => gt.Name.Contains(movieFilterDto.Genre))));
        }

        if (movieFilterDto.Year.HasValue)
            query = query.Where(m => m.Year == movieFilterDto.Year);

        if (movieFilterDto.MinPrice.HasValue)
            query = query.Where(m => m.Cost >= movieFilterDto.MinPrice.Value);

        if (movieFilterDto.MaxPrice.HasValue)
            query = query.Where(m => m.Cost <= movieFilterDto.MaxPrice.Value);

        if (!string.IsNullOrWhiteSpace(movieFilterDto.Director))
            query = query.Where(m => m.MoviePeople.Any(mp =>
                mp.Role == "Director" && (mp.Person.Name.Contains(movieFilterDto.Director)
                || mp.Person.Surname.Contains(movieFilterDto.Director))));

        if (!string.IsNullOrWhiteSpace(movieFilterDto.Actor))
            query = query.Where(m => m.MoviePeople.Any(mp =>
                mp.Role == "Actor" && (mp.Person.Name.Contains(movieFilterDto.Actor) ||
                mp.Person.Surname.Contains(movieFilterDto.Actor))));

        int totalCount = await query.CountAsync();

        var dataQuery = query
            .AsNoTracking()
            .Include(m => m.MovieTranslations)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                    .ThenInclude(g => g.GenreTranslations)
            .Include(m => m.MoviePeople)
                .ThenInclude(mp => mp.Person)
            .Include(m => m.Format)
            .AsSplitQuery()
            .OrderBy(m => m.MovieId).AsQueryable();

        if (pageIndex.HasValue && pageSize.HasValue)
        {
            dataQuery = dataQuery.Skip(pageIndex.Value * pageSize.Value).Take(pageSize.Value);
        }
        else
        {
            dataQuery = dataQuery.Take(AppConstants.MaxDownloadExcelMovies);
        }

        var movies = await dataQuery.ToListAsync();

        return (movies, totalCount);
    }

    public async Task<Movie?> GetByIdAsync(int id)
    {
        return await _dbContext.Movies
            .Include(m => m.MovieTranslations)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                    .ThenInclude(g => g.GenreTranslations)
            .Include(m => m.MoviePeople)
                .ThenInclude(mp => mp.Person)
            .AsSingleQuery()
            .FirstOrDefaultAsync(m => m.MovieId == id);
    }

    public async Task<int> GetCountAsync()
    {
        return await _dbContext.Movies.CountAsync();
    }

    public void Delete(Movie movie)
    {
        _dbContext.Movies.Remove(movie);
    }

    public async Task<Movie> AddAsync(Movie movie)
    {
        await _dbContext.Movies.AddAsync(movie);
        return movie;
    }

    public async Task<IEnumerable<Movie>> GetMoviesByGenreIdAsync(int genreId, int movieId, int quantity)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreId) && m.MovieId != movieId)
            .Include(m => m.MovieTranslations)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                    .ThenInclude(g => g.GenreTranslations)
            .Include(m => m.MoviePeople)
                .ThenInclude(mp => mp.Person)
            .AsSplitQuery()
            .OrderBy(m => m.MovieId)
            .Take(quantity)
            .ToListAsync();
    }

    public async Task<IEnumerable<Movie>> GetCultMoviesAsync(int limit)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => m.IsCult == true)
            .Include(m => m.MovieTranslations)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                    .ThenInclude(g => g.GenreTranslations)
            .Include(m => m.MoviePeople)
                .ThenInclude(mp => mp.Person)
            .AsSplitQuery()
            .OrderBy(m => m.MovieId)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<GenreTranslation>> GetGenresAsync(string lang)
    {
        return await _dbContext.GenreTranslations
            .AsNoTracking()
            .Where(gt => gt.LanguageCode == lang)
            .OrderBy(gt => gt.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Format>> GetFormatsAsync()
    {
        return await _dbContext.Formats
            .AsNoTracking()
            .OrderBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Movie>> GetMoviesByQueryAsync(string query, string lang, int limit)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => m.MovieTranslations.Any(mt => mt.LanguageCode == lang && mt.Title.Contains(query)))
            .Include(m => m.MovieTranslations.Where(mt => mt.LanguageCode == lang && mt.Title.Contains(query)))
            .Take(limit)
            .ToListAsync();
    }

    public async Task<int> GetCultMoviesCount()
    {
        return await _dbContext.Movies.Where(m => m.IsCult == true).CountAsync();
    }

    public async Task<IEnumerable<GenreStatistics>> GetMoviesCountForEveryGenre(string lang)
    {
        return await _dbContext.MovieGenres
            .GroupBy(mg => new
            {
                mg.GenreId,
                Name = mg.Genre.GenreTranslations
                    .Where(gt => gt.LanguageCode == lang)
                    .Select(gt => gt.Name)
                    .FirstOrDefault()
            })
            .Select(g => new GenreStatistics
            {
                GenreName = g.Key.Name ?? "Unknown",
                MovieCount = g.Count()
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GenreRevenueStatistic>> GetRevenuePerGenreAsync(string lang)
    {
        throw new NotImplementedException();
    }
}