namespace MovieWorld.Dtos;

public class ValidateCouponRequest
{
    public string Code { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
}
