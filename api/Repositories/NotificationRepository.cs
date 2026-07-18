using Microsoft.EntityFrameworkCore;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class NotificationRepository : BaseRepository, INotificationRepository
{
    public NotificationRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {
    }

    public async Task<(IEnumerable<Notification> Notifications, int TotalCount)> GetByUserIdAsync(int userId, int pageIndex, int pageSize)
    {
        var query = _dbContext.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

        var totalCount = await query.CountAsync();

        var notifications = await query
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (notifications, totalCount);
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _dbContext.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task AddAsync(Notification notification)
    {
        await _dbContext.Notifications.AddAsync(notification);
    }

    public async Task<Notification?> GetByIdAsync(int notificationId)
    {
        return await _dbContext.Notifications.FirstOrDefaultAsync(n => n.NotificationId == notificationId);
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _dbContext.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(n => n.IsRead, true));
    }
}
