namespace MovieWorld.Dtos;

public class NewsFilters
{
    public string Query { get; set; } = string.Empty;

    public string MovieQuery { get; set; } = string.Empty;

    public string ActorQuery { get; set; } = string.Empty;

    public int Year { get; set; }
}
