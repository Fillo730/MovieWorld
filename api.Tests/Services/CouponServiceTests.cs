using Moq;
using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;
using MovieWorld.Services;
using Xunit;

namespace MovieWorld.Tests.Services;

public class CouponServiceTests
{
    private readonly Mock<ICouponRepository> _repositoryMock = new();
    private readonly CouponService _sut;

    public CouponServiceTests()
    {
        _sut = new CouponService(_repositoryMock.Object);
    }

    [Fact]
    public async Task ValidateCouponAsync_ReturnsInvalid_WhenCouponNotFound()
    {
        _repositoryMock.Setup(r => r.GetByCodeAsync("NOTFOUND")).ReturnsAsync((Coupon?)null);

        var result = await _sut.ValidateCouponAsync("notfound", 100m);

        Assert.False(result.IsValid);
        Assert.Equal("Codice sconto non valido.", result.ErrorMessage);
    }

    [Fact]
    public async Task ValidateCouponAsync_ReturnsInvalid_WhenCouponInactive()
    {
        var coupon = new Coupon { Code = "INACTIVE10", DiscountPercentage = 10, IsActive = false };
        _repositoryMock.Setup(r => r.GetByCodeAsync("INACTIVE10")).ReturnsAsync(coupon);

        var result = await _sut.ValidateCouponAsync("INACTIVE10", 100m);

        Assert.False(result.IsValid);
        Assert.Equal("Codice sconto non più valido.", result.ErrorMessage);
    }

    [Fact]
    public async Task ValidateCouponAsync_ReturnsInvalid_WhenCouponExpired()
    {
        var coupon = new Coupon
        {
            Code = "EXPIRED10",
            DiscountPercentage = 10,
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(-1)
        };
        _repositoryMock.Setup(r => r.GetByCodeAsync("EXPIRED10")).ReturnsAsync(coupon);

        var result = await _sut.ValidateCouponAsync("EXPIRED10", 100m);

        Assert.False(result.IsValid);
        Assert.Equal("Codice sconto scaduto.", result.ErrorMessage);
    }

    [Fact]
    public async Task ValidateCouponAsync_ReturnsInvalid_WhenMaxUsesReached()
    {
        var coupon = new Coupon
        {
            Code = "MAXEDOUT",
            DiscountPercentage = 10,
            IsActive = true,
            MaxUses = 5,
            UsesCount = 5
        };
        _repositoryMock.Setup(r => r.GetByCodeAsync("MAXEDOUT")).ReturnsAsync(coupon);

        var result = await _sut.ValidateCouponAsync("MAXEDOUT", 100m);

        Assert.False(result.IsValid);
        Assert.Equal("Codice sconto esaurito.", result.ErrorMessage);
    }

    [Fact]
    public async Task ValidateCouponAsync_ReturnsValid_WithCorrectlyRoundedDiscountAmount()
    {
        var coupon = new Coupon
        {
            Code = "SAVE10",
            DiscountPercentage = 10,
            IsActive = true,
            MaxUses = null,
            ExpiresAt = null
        };
        _repositoryMock.Setup(r => r.GetByCodeAsync("SAVE10")).ReturnsAsync(coupon);

        var result = await _sut.ValidateCouponAsync("SAVE10", 33.33m);

        Assert.True(result.IsValid);
        Assert.Null(result.ErrorMessage);
        Assert.Equal(3.33m, result.DiscountAmount);
        Assert.Equal(10, result.DiscountPercentage);
    }

    [Fact]
    public async Task ValidateCouponAsync_NormalizesCodeToUppercaseBeforeLookup()
    {
        var coupon = new Coupon { Code = "LOWER5", DiscountPercentage = 5, IsActive = true };
        _repositoryMock.Setup(r => r.GetByCodeAsync("LOWER5")).ReturnsAsync(coupon);

        var result = await _sut.ValidateCouponAsync("  lower5  ", 100m);

        Assert.True(result.IsValid);
        _repositoryMock.Verify(r => r.GetByCodeAsync("LOWER5"), Times.Once);
    }

    [Fact]
    public async Task CreateCouponAsync_ReturnsError_WhenCodeIsEmpty()
    {
        var request = new CreateCouponDto { Code = "  ", DiscountPercentage = 10 };

        var (createdCoupon, error) = await _sut.CreateCouponAsync(request);

        Assert.Null(createdCoupon);
        Assert.Equal("Il codice sconto è obbligatorio.", error);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(101)]
    public async Task CreateCouponAsync_ReturnsError_WhenDiscountPercentageOutOfRange(decimal discount)
    {
        var request = new CreateCouponDto { Code = "BADRANGE", DiscountPercentage = discount };

        var (createdCoupon, error) = await _sut.CreateCouponAsync(request);

        Assert.Null(createdCoupon);
        Assert.Equal("La percentuale di sconto deve essere tra 1 e 100.", error);
    }

    [Fact]
    public async Task CreateCouponAsync_ReturnsError_WhenCodeAlreadyExists()
    {
        var request = new CreateCouponDto { Code = "DUPLICATE", DiscountPercentage = 10 };
        _repositoryMock.Setup(r => r.ExistsByCodeAsync("DUPLICATE")).ReturnsAsync(true);

        var (createdCoupon, error) = await _sut.CreateCouponAsync(request);

        Assert.Null(createdCoupon);
        Assert.Equal("Esiste già un codice sconto con questo nome.", error);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Coupon>()), Times.Never);
    }

    [Fact]
    public async Task CreateCouponAsync_NormalizesCodeToUppercase_AndPersistsCoupon()
    {
        var request = new CreateCouponDto { Code = " summer2026 ", DiscountPercentage = 15, MaxUses = 10 };
        _repositoryMock.Setup(r => r.ExistsByCodeAsync("SUMMER2026")).ReturnsAsync(false);

        var (createdCoupon, error) = await _sut.CreateCouponAsync(request);

        Assert.Null(error);
        Assert.NotNull(createdCoupon);
        Assert.Equal("SUMMER2026", createdCoupon!.Code);
        Assert.True(createdCoupon.IsActive);
        Assert.Equal(0, createdCoupon.UsesCount);
        _repositoryMock.Verify(r => r.AddAsync(It.Is<Coupon>(c => c.Code == "SUMMER2026" && c.DiscountPercentage == 15)), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task ToggleCouponActiveAsync_ReturnsFalse_WhenCouponNotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Coupon?)null);

        var (success, error) = await _sut.ToggleCouponActiveAsync(999);

        Assert.False(success);
        Assert.Equal("Coupon non trovato.", error);
    }

    [Fact]
    public async Task ToggleCouponActiveAsync_FlipsIsActive_WhenCouponFound()
    {
        var coupon = new Coupon { CouponId = 1, Code = "TOGGLEME", IsActive = true };
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(coupon);

        var (success, error) = await _sut.ToggleCouponActiveAsync(1);

        Assert.True(success);
        Assert.Null(error);
        Assert.False(coupon.IsActive);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
