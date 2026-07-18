using MovieWorld.Models;

namespace MovieWorld.IRepositories;

public interface INotificationRepository
{
    Task<(IEnumerable<Notification> Notifications, int TotalCount)> GetByUserIdAsync(int userId, int pageIndex, int pageSize);
    Task<int> GetUnreadCountAsync(int userId);
    Task AddAsync(Notification notification);
    Task<Notification?> GetByIdAsync(int notificationId);
    Task MarkAllAsReadAsync(int userId);
    Task SaveChangesAsync();
}
