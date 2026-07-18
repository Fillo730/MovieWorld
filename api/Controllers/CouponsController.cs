using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CouponsController(ICouponService couponService) : BaseController
{
    private readonly ICouponService _couponService = couponService;

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponRequest request)
    {
        try
        {
            var result = await _couponService.ValidateCouponAsync(request.Code, request.Subtotal);

            return Ok(ApiResponse<CouponValidationResultDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CouponValidationResultDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats")]
    public async Task<IActionResult> GetCouponStats()
    {
        try
        {
            var stats = await _couponService.GetCouponStatsAsync();

            return Ok(ApiResponse<CouponStatsDto>.CreateSuccessResponse(stats));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CouponStatsDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllCoupons()
    {
        try
        {
            var coupons = await _couponService.GetAllCouponsAsync();

            return Ok(ApiResponse<IEnumerable<CouponDto>>.CreateSuccessResponse(coupons));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<CouponDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponDto request)
    {
        try
        {
            var (coupon, error) = await _couponService.CreateCouponAsync(request);

            if (coupon is null)
            {
                return Ok(ApiResponse<CouponDto>.CreateFailureResponse(error ?? "Errore durante la creazione del coupon."));
            }

            return Ok(ApiResponse<CouponDto>.CreateSuccessResponse(coupon));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CouponDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/toggle")]
    public async Task<IActionResult> ToggleCoupon(int id)
    {
        try
        {
            var (success, error) = await _couponService.ToggleCouponActiveAsync(id);

            if (!success)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse(error ?? "Errore durante l'aggiornamento del coupon."));
            }

            return Ok(ApiResponse<string>.CreateSuccessResponse("Coupon aggiornato con successo."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }
}
