namespace MovieWorld.Dtos;

public class MovieReviewsSummaryDto
{
    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }

    public PagedResult<ReviewDto> Reviews { get; set; }
}
