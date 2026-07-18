using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Services;

public class NotificationService(INotificationRepository notificationRepository) : INotificationService
{
    private readonly INotificationRepository _notificationRepository = notificationRepository;

    public async Task<PagedResult<NotificationDto>> GetUserNotificationsAsync(int userId, int pageIndex, int pageSize)
    {
        var (notifications, totalCount) = await _notificationRepository.GetByUserIdAsync(userId, pageIndex, pageSize);

        return new PagedResult<NotificationDto>
        {
            Items = notifications.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _notificationRepository.GetUnreadCountAsync(userId);
    }

    public async Task CreateNotificationAsync(int userId, string message, string? link = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
            Link = link,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.AddAsync(notification);
        await _notificationRepository.SaveChangesAsync();
    }

    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);

        if (notification is null || notification.UserId != userId)
        {
            return false;
        }

        notification.IsRead = true;
        await _notificationRepository.SaveChangesAsync();

        return true;
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _notificationRepository.MarkAllAsReadAsync(userId);
    }

    private static NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            NotificationId = notification.NotificationId,
            Message = notification.Message,
            Link = notification.Link,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}
