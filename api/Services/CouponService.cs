using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class CouponService(ICouponRepository couponRepository) : ICouponService
{
    private readonly ICouponRepository _couponRepository = couponRepository;

    public async Task<IEnumerable<CouponDto>> GetAllCouponsAsync()
    {
        var coupons = await _couponRepository.GetAllAsync();

        return coupons.Select(MapToDto);
    }

    public async Task<(CouponDto? Coupon, string? Error)> CreateCouponAsync(CreateCouponDto request)
    {
        var normalizedCode = request.Code?.Trim().ToUpperInvariant() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(normalizedCode))
        {
            return (null, "Il codice sconto è obbligatorio.");
        }

        if (request.DiscountPercentage <= 0 || request.DiscountPercentage > 100)
        {
            return (null, "La percentuale di sconto deve essere tra 1 e 100.");
        }

        if (await _couponRepository.ExistsByCodeAsync(normalizedCode))
        {
            return (null, "Esiste già un codice sconto con questo nome.");
        }

        var coupon = new Coupon
        {
            Code = normalizedCode,
            DiscountPercentage = request.DiscountPercentage,
            ExpiresAt = request.ExpiresAt,
            MaxUses = request.MaxUses,
            IsActive = true,
            UsesCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _couponRepository.AddAsync(coupon);
        await _couponRepository.SaveChangesAsync();

        return (MapToDto(coupon), null);
    }

    public async Task<(bool Success, string? Error)> ToggleCouponActiveAsync(int couponId)
    {
        var coupon = await _couponRepository.GetByIdAsync(couponId);

        if (coupon is null)
        {
            return (false, "Coupon non trovato.");
        }

        coupon.IsActive = !coupon.IsActive;

        await _couponRepository.SaveChangesAsync();

        return (true, null);
    }

    public async Task<CouponValidationResultDto> ValidateCouponAsync(string code, decimal subtotal)
    {
        var normalizedCode = code?.Trim().ToUpperInvariant() ?? string.Empty;

        var coupon = await _couponRepository.GetByCodeAsync(normalizedCode);

        if (coupon is null)
        {
            return new CouponValidationResultDto { IsValid = false, ErrorMessage = "Codice sconto non valido." };
        }

        if (!coupon.IsActive)
        {
            return new CouponValidationResultDto { IsValid = false, ErrorMessage = "Codice sconto non più valido." };
        }

        if (coupon.ExpiresAt.HasValue && coupon.ExpiresAt.Value < DateTime.UtcNow)
        {
            return new CouponValidationResultDto { IsValid = false, ErrorMessage = "Codice sconto scaduto." };
        }

        if (coupon.MaxUses.HasValue && coupon.UsesCount >= coupon.MaxUses.Value)
        {
            return new CouponValidationResultDto { IsValid = false, ErrorMessage = "Codice sconto esaurito." };
        }

        var discountAmount = Math.Round(subtotal * coupon.DiscountPercentage / 100m, 2);

        return new CouponValidationResultDto
        {
            IsValid = true,
            Code = coupon.Code,
            DiscountPercentage = coupon.DiscountPercentage,
            DiscountAmount = discountAmount
        };
    }

    public async Task IncrementCouponUsageAsync(string code)
    {
        var normalizedCode = code?.Trim().ToUpperInvariant() ?? string.Empty;

        var coupon = await _couponRepository.GetByCodeAsync(normalizedCode);

        if (coupon is not null)
        {
            coupon.UsesCount++;
            await _couponRepository.SaveChangesAsync();
        }
    }

    public async Task<CouponStatsDto> GetCouponStatsAsync()
    {
        var usageStats = await _couponRepository.GetUsageStatisticsAsync();

        return new CouponStatsDto
        {
            TotalDiscountGiven = usageStats.Sum(s => s.TotalDiscount),
            TotalRedemptions = usageStats.Sum(s => s.UsesCount),
            TopCoupons = usageStats.Select(s => new CouponUsageStatDto
            {
                Code = s.Code,
                UsesCount = s.UsesCount,
                TotalDiscount = s.TotalDiscount
            }).ToList()
        };
    }

    private static CouponDto MapToDto(Coupon coupon)
    {
        return new CouponDto
        {
            CouponId = coupon.CouponId,
            Code = coupon.Code,
            DiscountPercentage = coupon.DiscountPercentage,
            ExpiresAt = coupon.ExpiresAt,
            MaxUses = coupon.MaxUses,
            UsesCount = coupon.UsesCount,
            IsActive = coupon.IsActive,
            CreatedAt = coupon.CreatedAt
        };
    }
}
