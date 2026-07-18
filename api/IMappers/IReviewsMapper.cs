using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IReviewsMapper
{
    ReviewDto MapToDto(Review review);

    IEnumerable<ReviewDto> MapToDtoList(IEnumerable<Review> reviews);

    UserReviewDto MapToUserReviewDto(Review review, string lang);

    IEnumerable<UserReviewDto> MapToUserReviewDtoList(IEnumerable<Review> reviews, string lang);
}
