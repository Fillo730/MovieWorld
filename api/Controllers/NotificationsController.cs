using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController(INotificationService notificationService) : BaseController
{
    private readonly INotificationService _notificationService = notificationService;

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var result = await _notificationService.GetUserNotificationsAsync(userId, pageIndex, pageSize);

            return Ok(ApiResponse<PagedResult<NotificationDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<NotificationDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        try
        {
            var userId = GetUserIdFromToken();

            var count = await _notificationService.GetUnreadCountAsync(userId);

            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var success = await _notificationService.MarkAsReadAsync(id, userId);

            if (!success)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse("Notifica non trovata."));
            }

            return Ok(ApiResponse<string>.CreateSuccessResponse("Notifica segnata come letta."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        try
        {
            var userId = GetUserIdFromToken();

            await _notificationService.MarkAllAsReadAsync(userId);

            return Ok(ApiResponse<string>.CreateSuccessResponse("Tutte le notifiche sono state segnate come lette."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }
}
