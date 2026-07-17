using Microsoft.EntityFrameworkCore;
using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class NewsRepository(TrainingBrattiContext dbcontext) : BaseRepository(dbcontext), INewsRepository
{
    public async Task<News> AddNewsAsync(News news)
    {
        await _dbContext.News.AddAsync(news);
        return news;
    }

    public void DeleteNewsAsync(News news)
    {
        _dbContext.News.Remove(news);
    }

    public async Task<(IEnumerable<News>, int totalCount)> GetAllNewsAsync(int pageIndex, int pageSize, NewsFilters filters, string lang)
    {
        var query = _dbContext.News.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            var titlePattern = $"%{filters.Query}%";
            query = query.Where(n => n.NewsTranslations.Any(nt => nt.LanguageCode == lang && EF.Functions.Like(nt.Title, titlePattern)));
        }

        if (!string.IsNullOrWhiteSpace(filters.MovieQuery))
        {
            var moviePattern = $"%{filters.MovieQuery}%";
            query = query.Where(n => n.Movies.Any(m => m.MovieTranslations.Any(mt => mt.LanguageCode == lang && EF.Functions.Like(mt.Title, moviePattern))));
        }

        if (!string.IsNullOrWhiteSpace(filters.ActorQuery))
        {
            var actorPattern = $"%{filters.ActorQuery}%";
            query = query.Where(n => n.People.Any(a => EF.Functions.Like(a.Name, actorPattern) || EF.Functions.Like(a.Surname, actorPattern)));
        }

        if (filters.Year > 0)
        {
            query = query.Where(n => n.Date.HasValue && n.Date.Value.Year == filters.Year);
        }

        int totalCount = await query.CountAsync();

        var items = await query
            .AsNoTracking()
            .Include(n => n.NewsTranslations.Where(t => t.LanguageCode == lang))
            .Include(n => n.Movies)
                .ThenInclude(m => m.MovieTranslations.Where(t => t.LanguageCode == lang))
            .Include(n => n.Movies)
                .ThenInclude(m => m.Format)
            .Include(n => n.Movies)
                .ThenInclude(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                        .ThenInclude(g => g.GenreTranslations.Where(t => t.LanguageCode == lang))
            .Include(n => n.People)
            .OrderByDescending(n => n.Date)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<News?> GetByIdAsync(int id)
    {
        return await _dbContext.News
            .Include(n => n.NewsTranslations)
            .Include(n => n.Movies)
                .ThenInclude(m => m.MovieTranslations)
            .Include(n => n.Movies)
                .ThenInclude(m => m.Format)
            .Include(n => n.Movies)
                .ThenInclude(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                        .ThenInclude(g => g.GenreTranslations)
            .Include(n => n.People)
            .FirstOrDefaultAsync(n => n.NewsId == id);
    }

    public async Task<News?> GetNewsByIdAsync(int id)
    {
        return await _dbContext.News
            .Include(n => n.NewsTranslations)
            .Include(n => n.Movies)
            .Include(n => n.People)
            .FirstOrDefaultAsync(n => n.NewsId == id);
    }

    public async Task<int> GetNewsCountAsync()
    {
        return await _dbContext.News.CountAsync();
    }
}