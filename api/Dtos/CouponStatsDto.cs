namespace MovieWorld.Dtos;

public class CouponStatsDto
{
    public decimal TotalDiscountGiven { get; set; }

    public int TotalRedemptions { get; set; }

    public List<CouponUsageStatDto> TopCoupons { get; set; } = new();
}

public class CouponUsageStatDto
{
    public string Code { get; set; } = string.Empty;

    public int UsesCount { get; set; }

    public decimal TotalDiscount { get; set; }
}
