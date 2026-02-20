namespace MovieWorld.Dtos;

public class SellPointsFilterDto
{
    public string City { get; set; } = string.Empty;

    public static SellPointsFilterDto CreateEmpty() => new SellPointsFilterDto();
}
