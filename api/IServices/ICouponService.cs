using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface ICouponService
{
    Task<IEnumerable<CouponDto>> GetAllCouponsAsync();
    Task<(CouponDto? Coupon, string? Error)> CreateCouponAsync(CreateCouponDto request);
    Task<(bool Success, string? Error)> ToggleCouponActiveAsync(int couponId);
    Task<CouponValidationResultDto> ValidateCouponAsync(string code, decimal subtotal);
    Task IncrementCouponUsageAsync(string code);
}
