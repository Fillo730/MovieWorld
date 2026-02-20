namespace MovieWorld.Dtos;

public class FormatDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public override string ToString()
    {
        return Name;
    }
}
