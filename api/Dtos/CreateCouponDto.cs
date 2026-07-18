namespace MovieWorld.Dtos;

public class CreateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal DiscountPercentage { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int? MaxUses { get; set; }
}
