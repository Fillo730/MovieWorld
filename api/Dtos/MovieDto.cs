namespace MovieWorld.Dtos;
public class MovieDto
{
    public int MovieId { get; set; }
    public string Title { get; set; } = null!;
    public string Story { get; set; } = null!;
    public decimal Cost { get; set; }
    public int Year { get; set; }

    public List<GenreDto> Genres { get; set; } = new List<GenreDto>();

    public FormatDto Format { get; set; } = null!;

    public string? ImagePath { get; set; }

    public string TrailerUrl { get; set; } = null!;

    public bool IsCult { get; set; }

    public PersonDto? Director { get; set; }

    public List<PersonDto> Actors { get; set; } = new();

    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }

    public static List<string> GetExcelHeaders() => new()
    {
        "ID", "Title", "Story", "Cost", "Release Year", "Genre",
        "Format", "Image Path", "Trailer URL", "Is Cult", "Director", "Cast"
    };
}

