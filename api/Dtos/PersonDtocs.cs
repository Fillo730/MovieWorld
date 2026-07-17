namespace MovieWorld.Dtos;
public class PersonDto
{
    public int PersonId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? ImagePath { get; set; }

    public override string ToString()
    {
        return FullName ?? string.Empty;
    }
}
