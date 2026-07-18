using Microsoft.EntityFrameworkCore;
using MovieWorld.Constants;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class CouponRepository : BaseRepository, ICouponRepository
{
    public CouponRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {
    }

    public async Task<Coupon?> GetByCodeAsync(string code)
    {
        return await _dbContext.Coupons.FirstOrDefaultAsync(c => c.Code == code);
    }

    public async Task<IEnumerable<Coupon>> GetAllAsync()
    {
        return await _dbContext.Coupons
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ExistsByCodeAsync(string code)
    {
        return await _dbContext.Coupons.AnyAsync(c => c.Code == code);
    }

    public async Task AddAsync(Coupon coupon)
    {
        await _dbContext.Coupons.AddAsync(coupon);
    }

    public async Task<Coupon?> GetByIdAsync(int id)
    {
        return await _dbContext.Coupons.FirstOrDefaultAsync(c => c.CouponId == id);
    }

    public async Task<IEnumerable<CouponUsageStatistic>> GetUsageStatisticsAsync()
    {
        var results = await _dbContext.Orders
            .Where(o => o.CouponCode != null && o.OrderStateId != (int)OrderStateEnum.Deleted)
            .GroupBy(o => o.CouponCode)
            .Select(g => new
            {
                Code = g.Key!,
                UsesCount = g.Count(),
                TotalDiscount = g.Sum(o => (double)o.DiscountAmount)
            })
            .ToListAsync();

        return results
            .OrderByDescending(r => r.TotalDiscount)
            .Select(r => new CouponUsageStatistic
            {
                Code = r.Code,
                UsesCount = r.UsesCount,
                TotalDiscount = (decimal)r.TotalDiscount
            });
    }
}
