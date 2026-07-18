using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface ICouponRepository
{
    Task<Coupon?> GetByCodeAsync(string code);
    Task<IEnumerable<Coupon>> GetAllAsync();
    Task<bool> ExistsByCodeAsync(string code);
    Task AddAsync(Coupon coupon);
    Task<Coupon?> GetByIdAsync(int id);
    Task<IEnumerable<CouponUsageStatistic>> GetUsageStatisticsAsync();
    Task SaveChangesAsync();
}
