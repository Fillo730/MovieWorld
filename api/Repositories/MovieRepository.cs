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
            var namePattern = $"%{movieFilterDto.Name}%";
            query = query.Where(m => m.MovieTranslations.Any(mt => EF.Functions.Like(mt.Title, namePattern)));
        }

        if (!string.IsNullOrEmpty(movieFilterDto.Genre))
        {
            var genrePattern = $"%{movieFilterDto.Genre}%";
            query = query.Where(m => m.MovieGenres.Any(mg =>
                mg.Genre.GenreTranslations.Any(gt => EF.Functions.Like(gt.Name, genrePattern))));
        }

        if (movieFilterDto.Year.HasValue)
            query = query.Where(m => m.Year == movieFilterDto.Year);

        if (movieFilterDto.MinPrice.HasValue)
            query = query.Where(m => m.Cost >= movieFilterDto.MinPrice.Value);

        if (movieFilterDto.MaxPrice.HasValue)
            query = query.Where(m => m.Cost <= movieFilterDto.MaxPrice.Value);

        if (!string.IsNullOrWhiteSpace(movieFilterDto.Director))
        {
            var directorPattern = $"%{movieFilterDto.Director}%";
            query = query.Where(m => m.MoviePeople.Any(mp =>
                mp.Role == "Director" && (EF.Functions.Like(mp.Person.Name, directorPattern)
                || EF.Functions.Like(mp.Person.Surname, directorPattern))));
        }

        if (!string.IsNullOrWhiteSpace(movieFilterDto.Actor))
        {
            var actorPattern = $"%{movieFilterDto.Actor}%";
            query = query.Where(m => m.MoviePeople.Any(mp =>
                mp.Role == "Actor" && (EF.Functions.Like(mp.Person.Name, actorPattern) ||
                EF.Functions.Like(mp.Person.Surname, actorPattern))));
        }

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
            .AsQueryable();

        dataQuery = movieFilterDto.SortBy switch
        {
            "rating_desc" => dataQuery.OrderByDescending(m => _dbContext.Reviews.Where(r => r.MovieId == m.MovieId).Average(r => (double?)r.Rating) ?? 0),
            "price_asc" => dataQuery.OrderBy(m => m.Cost),
            "price_desc" => dataQuery.OrderByDescending(m => m.Cost),
            _ => dataQuery.OrderBy(m => m.MovieId)
        };

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

    public async Task<IEnumerable<Movie>> GetTopRatedMoviesAsync(int limit)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => _dbContext.Reviews.Any(r => r.MovieId == m.MovieId))
            .Include(m => m.MovieTranslations)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                    .ThenInclude(g => g.GenreTranslations)
            .Include(m => m.MoviePeople)
                .ThenInclude(mp => mp.Person)
            .AsSplitQuery()
            .OrderByDescending(m => _dbContext.Reviews.Where(r => r.MovieId == m.MovieId).Average(r => (double)r.Rating))
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
        var pattern = $"%{query}%";
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => m.MovieTranslations.Any(mt => mt.LanguageCode == lang && EF.Functions.Like(mt.Title, pattern)))
            .Include(m => m.MovieTranslations.Where(mt => mt.LanguageCode == lang && EF.Functions.Like(mt.Title, pattern)))
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
        return await _dbContext.OrderItems
            .Where(oi => oi.Order.OrderStateId != (int)OrderStateEnum.Deleted)
            .SelectMany(oi => oi.Movie.MovieGenres, (oi, mg) => new { oi, mg })
            .GroupBy(x => new
            {
                x.mg.GenreId,
                Name = x.mg.Genre.GenreTranslations
                    .Where(gt => gt.LanguageCode == lang)
                    .Select(gt => gt.Name)
                    .FirstOrDefault()
            })
            .Select(g => new GenreRevenueStatistic
            {
                Name = g.Key.Name ?? "Unknown",
                Revenue = (decimal)g.Sum(x => (double)(x.oi.Quantity * x.oi.PurchasedPrice))
            })
            .OrderBy(r => r.Name)
            .ToListAsync();
    }
}