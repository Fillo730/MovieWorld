using MovieWorld.Constants;

namespace MovieWorld.Dtos;

public class PersonFilterDto
{
    public string Query { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
}
