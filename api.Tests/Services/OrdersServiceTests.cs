using Moq;
using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;
using MovieWorld.Services;
using Xunit;

namespace MovieWorld.Tests.Services;

public class OrdersServiceTests
{
    private readonly Mock<IOrdersRepository> _ordersRepositoryMock = new();
    private readonly Mock<IOrdersMapper> _ordersMapperMock = new();
    private readonly Mock<IPagedMapper> _pagedMapperMock = new();
    private readonly Mock<IStatisticsMapper> _statisticsMapperMock = new();
    private readonly Mock<INotificationService> _notificationServiceMock = new();
    private readonly Mock<IEmailService> _emailServiceMock = new();
    private readonly OrdersService _sut;

    public OrdersServiceTests()
    {
        _sut = new OrdersService(
            _ordersRepositoryMock.Object,
            _ordersMapperMock.Object,
            _pagedMapperMock.Object,
            _statisticsMapperMock.Object,
            _notificationServiceMock.Object,
            _emailServiceMock.Object);
    }

    private static Order BuildOrder(int orderId, int userId, int orderStateId, bool emailNotificationsEnabled = true)
    {
        return new Order
        {
            OrderId = orderId,
            UserId = userId,
            OrderStateId = orderStateId,
            User = new User
            {
                UserId = userId,
                Email = "customer@example.com",
                Name = "Mario",
                EmailNotificationsEnabled = emailNotificationsEnabled
            }
        };
    }

    private static OrderDto BuildOrderDto(int orderId, int newStateId, string newStateName)
    {
        return new OrderDto
        {
            Id = orderId,
            State = new OrderStateDto { Id = newStateId, Name = newStateName },
            User = new UserDto { UserId = 1, Email = "customer@example.com", Name = "Mario", Surname = "Rossi", ImagePath = "" },
            SellPoint = new SellPointDto { Id = 1, Name = "Store" }
        };
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenOrderNotFound()
    {
        _ordersRepositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Order?)null);

        var result = await _sut.UpdateAsync(new OrderDto { Id = 999, State = new OrderStateDto { Id = 1, Name = "X" } }, "it");

        Assert.Null(result);
        _notificationServiceMock.Verify(n => n.CreateNotificationAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string?>()), Times.Never);
        _emailServiceMock.Verify(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_CreatesNotificationAndSendsEmail_WhenStateChanges()
    {
        var existingOrder = BuildOrder(orderId: 10, userId: 5, orderStateId: 1, emailNotificationsEnabled: true);
        var requestDto = BuildOrderDto(orderId: 10, newStateId: 3, newStateName: "Spedito");

        _ordersRepositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(existingOrder);
        _ordersMapperMock
            .Setup(m => m.MapUpdateToDb(requestDto, existingOrder))
            .Callback<OrderDto, Order>((dto, order) => order.OrderStateId = dto.State.Id);
        _ordersMapperMock.Setup(m => m.MapToDto(existingOrder, "it")).Returns(requestDto);

        var result = await _sut.UpdateAsync(requestDto, "it");

        Assert.NotNull(result);
        _notificationServiceMock.Verify(n => n.CreateNotificationAsync(
            5,
            It.Is<string>(msg => msg.Contains("#10") && msg.Contains("Spedito")),
            "/your-orders"), Times.Once);
        _emailServiceMock.Verify(e => e.SendEmailAsync(
            "customer@example.com",
            "Mario",
            It.Is<string>(subject => subject.Contains("#10")),
            It.Is<string>(body => body.Contains("Spedito"))), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_DoesNotNotifyOrEmail_WhenStateIsUnchanged()
    {
        var existingOrder = BuildOrder(orderId: 11, userId: 5, orderStateId: 2, emailNotificationsEnabled: true);
        var requestDto = BuildOrderDto(orderId: 11, newStateId: 2, newStateName: "In lavorazione");

        _ordersRepositoryMock.Setup(r => r.GetByIdAsync(11)).ReturnsAsync(existingOrder);
        _ordersMapperMock
            .Setup(m => m.MapUpdateToDb(requestDto, existingOrder))
            .Callback<OrderDto, Order>((dto, order) => order.OrderStateId = dto.State.Id);
        _ordersMapperMock.Setup(m => m.MapToDto(existingOrder, "it")).Returns(requestDto);

        await _sut.UpdateAsync(requestDto, "it");

        _notificationServiceMock.Verify(n => n.CreateNotificationAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string?>()), Times.Never);
        _emailServiceMock.Verify(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_CreatesNotification_ButSkipsEmail_WhenUserDisabledEmailNotifications()
    {
        var existingOrder = BuildOrder(orderId: 12, userId: 5, orderStateId: 1, emailNotificationsEnabled: false);
        var requestDto = BuildOrderDto(orderId: 12, newStateId: 3, newStateName: "Spedito");

        _ordersRepositoryMock.Setup(r => r.GetByIdAsync(12)).ReturnsAsync(existingOrder);
        _ordersMapperMock
            .Setup(m => m.MapUpdateToDb(requestDto, existingOrder))
            .Callback<OrderDto, Order>((dto, order) => order.OrderStateId = dto.State.Id);
        _ordersMapperMock.Setup(m => m.MapToDto(existingOrder, "it")).Returns(requestDto);

        await _sut.UpdateAsync(requestDto, "it");

        _notificationServiceMock.Verify(n => n.CreateNotificationAsync(5, It.IsAny<string>(), "/your-orders"), Times.Once);
        _emailServiceMock.Verify(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
