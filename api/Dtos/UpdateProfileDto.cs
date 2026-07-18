namespace MovieWorld.Dtos;

public class UpdateProfileDto
{
    public string Name { get; set; }

    public string Surname { get; set; }

    public string ImagePath { get; set; }

    public int? PreferredSellPointId { get; set; }

    public bool EmailNotificationsEnabled { get; set; } = true;
}
