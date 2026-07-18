namespace MovieWorld.Models;

public class CouponUsageStatistic
{
    public string Code { get; set; } = string.Empty;

    public int UsesCount { get; set; }

    public decimal TotalDiscount { get; set; }
}
