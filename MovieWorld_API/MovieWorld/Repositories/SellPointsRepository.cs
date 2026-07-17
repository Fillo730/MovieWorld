using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class SellPointsRepository : BaseRepository, ISellPointsRepository
{
    public SellPointsRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {

    }

    public async Task<IEnumerable<string>> GetCitiesAsync(string lang)
    {
        return await _dbContext.SellPointTranslations
            .AsNoTracking()
            .Where(t => t.LanguageCode.Equals(lang))
            .Select(t => t.City)
            .Distinct()
            .ToListAsync();
    }

    public async Task<IEnumerable<SellPoint>> GetNearestSellPointsAsync(double userLat, double userLng, int limit, string lang)
    {
        return await _dbContext.SellPoints
            .AsNoTracking() 
            .Where(sp => sp.SellPointTranslations.Any(t => t.LanguageCode == lang))
            .OrderBy(sp =>
                Math.Pow((sp.Lat ?? 0) - userLat, 2) + Math.Pow((sp.Lng ?? 0) - userLng, 2))
            .Take(limit)
            .Include(sp => sp.SellPointTranslations.Where(t => t.LanguageCode == lang))
            .ToListAsync();
    }

    public async Task<(IEnumerable<SellPoint>, int)> GetSellPointsAsync(SellPointsFilterDto filters, string lang, int? pageIndex, int? pageSize)
    {
        var query = _dbContext.SellPoints.AsQueryable();

        if (!string.IsNullOrEmpty(filters.City))
        {
            var pattern = $"%{filters.City}%";
            query = query.Where(sp => sp.SellPointTranslations.Any(t => EF.Functions.Like(t.City, pattern) && t.LanguageCode.Equals(lang)));
        }

        int totalCount = await query.CountAsync();

        query = query
            .AsNoTracking()
            .Include(sp => sp.SellPointTranslations)
            .AsSplitQuery()
            .OrderBy(sp => sp.SellPointId);

        if(pageSize.HasValue && pageIndex.HasValue)
        {
            query = query.Skip(pageIndex.Value * pageSize.Value)
            .Take(pageSize.Value);
        }

        var sellPoints = await query.ToListAsync();

        return (sellPoints, totalCount);
    }

    public async Task<(IEnumerable<SellPoint>, int)> GetSellPointsByMoviesAsync(IEnumerable<int> movieIds, int pageIndex, int pageSize, string lang, double? userLat, double? userLng)
    {
        var query = _dbContext.SellPoints
            .AsNoTracking()
            .Where(sp => sp.MovieSellPoints.Any(m => movieIds.Contains(m.MovieId)));

        var total = await query.CountAsync();

        if (userLat.HasValue && userLng.HasValue)
        {
            query = query.OrderBy(sp =>
                Math.Pow((sp.Lat ?? 0) - userLat.Value, 2) + Math.Pow((sp.Lng ?? 0) - userLng.Value, 2));
        }
        else
        {
            query = query.OrderBy(sp => sp.SellPointId);
        }

        var result = await query
            .Include(sp => sp.SellPointTranslations.Where(t => t.LanguageCode == lang))
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .AsSplitQuery()
            .ToListAsync();

        return (result, total);
    }

    public async Task<IEnumerable<SellPoint>> GetSellPointsByQuery(string query, string lang, int limit)
    {
        var pattern = $"%{query}%";
        var result = await _dbContext.SellPoints
            .AsNoTracking()
            .Include(sp => sp.SellPointTranslations.Where(t => t.LanguageCode == lang))
            .Where(sp => sp.SellPointTranslations.Any(t => t.LanguageCode == lang &&
                                                          (EF.Functions.Like(t.Address, pattern) || EF.Functions.Like(t.City, pattern))))
            .Take(limit)
            .ToListAsync();
        return result;
    }
}