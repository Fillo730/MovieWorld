using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class ReviewsMapper : IReviewsMapper
{
    public ReviewDto MapToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.ReviewId,
            MovieId = review.MovieId,
            UserId = review.UserId,
            UserName = $"{review.User.Name} {review.User.Surname}",
            UserImagePath = review.User.ImagePath,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
        };
    }

    public IEnumerable<ReviewDto> MapToDtoList(IEnumerable<Review> reviews)
    {
        return reviews.Select(MapToDto);
    }

    public UserReviewDto MapToUserReviewDto(Review review, string lang)
    {
        var translation = review.Movie.MovieTranslations?
            .FirstOrDefault(mt => mt.LanguageCode == lang);

        return new UserReviewDto
        {
            Id = review.ReviewId,
            MovieId = review.MovieId,
            MovieTitle = translation?.Title ?? "N/A",
            MovieImagePath = review.Movie.ImagePath,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
        };
    }

    public IEnumerable<UserReviewDto> MapToUserReviewDtoList(IEnumerable<Review> reviews, string lang)
    {
        return reviews.Select(r => MapToUserReviewDto(r, lang));
    }
}
