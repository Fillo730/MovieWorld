namespace MovieWorld.Dtos;

public class NotificationDto
{
    public int NotificationId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
