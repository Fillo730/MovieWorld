using Microsoft.EntityFrameworkCore;
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
}
