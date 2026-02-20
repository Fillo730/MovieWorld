namespace MovieWorld.Dtos;

public class MovieFilterDto
{
    public string? Name { get; set; }
    public string? Genre { get; set; }
    public int? Year { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Director { get; set; }
    public string? Actor { get; set; }

    public static MovieFilterDto CreateEmpty() => new MovieFilterDto();
}
