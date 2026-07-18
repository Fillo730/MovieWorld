#nullable disable
using System;

namespace MovieWorld.Models;

public partial class Coupon
{
    public int CouponId { get; set; }

    public string Code { get; set; }

    public decimal DiscountPercentage { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public int? MaxUses { get; set; }

    public int UsesCount { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
