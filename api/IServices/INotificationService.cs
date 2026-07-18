using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface INotificationService
{
    Task<PagedResult<NotificationDto>> GetUserNotificationsAsync(int userId, int pageIndex, int pageSize);
    Task<int> GetUnreadCountAsync(int userId);
    Task CreateNotificationAsync(int userId, string message, string? link = null);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
    Task MarkAllAsReadAsync(int userId);
}
