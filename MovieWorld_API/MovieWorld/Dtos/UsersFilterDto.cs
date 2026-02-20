namespace MovieWorld.Dtos;

public class UsersFilterDto
{
    public string Query { get; set; } = string.Empty;

    public int Role { get; set; } = -1;

    public int Year { get; set; } = 0;
}
