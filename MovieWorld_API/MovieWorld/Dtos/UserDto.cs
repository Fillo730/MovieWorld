namespace MovieWorld.Dtos;

public class UserDto
{
    public int UserId { get; set; }

    public string Email { get; set; }

    public string Name { get; set; }

    public string Surname { get; set; }

    public string ImagePath { get; set; }

    public int Role { get; set; }

    public DateTime? CreatedAt { get; set; }
}