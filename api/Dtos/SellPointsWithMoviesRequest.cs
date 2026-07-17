namespace MovieWorld.Dtos;

public class SellPointsWithMoviesRequest
{
    public List<int> MovieIds { get; set; } = new();
    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public double? UserLat { get; set; }

    public double? UserLng { get; set; }
}
