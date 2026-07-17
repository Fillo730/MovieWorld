using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;

namespace MovieWorld.Mappers;

public class StatisticsMapper (IUsersMapper usersMapper) : IStatisticsMapper
{
    private readonly IUsersMapper _usersMapper = usersMapper;
    public GenreStatDto MapToGenreStatDto(GenreStatistics genreStatDto)
    {
        return new GenreStatDto
        {
            GenreName = genreStatDto.GenreName,
            MovieCount = genreStatDto.MovieCount,
        };
    }

    public IEnumerable<GenreStatDto> MapToGenreStatDtoList(IEnumerable<GenreStatistics> genreStatistics)
    {
        return genreStatistics.Select(g => MapToGenreStatDto((g)));
    }

    public OrdersPerOrderStateStatisticDto MapToOrdersPerOrderStateDto(OrdersPerOrderStateStatistic stat)
    {
        return new OrdersPerOrderStateStatisticDto
        {
            Name = stat.OrderStateName,
            Count = stat.OrderCount
        };
    }

    public IEnumerable<OrdersPerOrderStateStatisticDto> MapToOrdersPerOrderStateDtoList(IEnumerable<OrdersPerOrderStateStatistic> stats)
    {
        return stats.Select(s => MapToOrdersPerOrderStateDto(s));
    }

    public RevenuePerYearStatisticDto MapToRevenuePerYearDto(RevenuePerYearStatistic stat)
    {
        return new RevenuePerYearStatisticDto
        {
            Year = stat.Year,
            Revenue = stat.Revenue,
        };
    }

    public IEnumerable<RevenuePerYearStatisticDto> MapToRevenuePerYearDtoList(IEnumerable<RevenuePerYearStatistic> stats)
    {
        return stats.Select(s =>  MapToRevenuePerYearDto((s)));
    }

    public UserMonthStatisticDto MapToUserMonthStatisticDto(UserMonthStatistic stat)
    {
        return new UserMonthStatisticDto
        {
            Year = stat.Year,
            Month = stat.Month,
            Count = stat.Count,
        };
    }

    public IEnumerable<UserMonthStatisticDto> MapToUserMonthStatisticDtoList(IEnumerable<UserMonthStatistic> stats)
    {
        return stats.Select(s => MapToUserMonthStatisticDto((s)));
    }

    public UserRevenueStatisticDto MapToUserRevenueDto(UserRevenueStatistic stat)
    {
        return new UserRevenueStatisticDto
        {
            User = _usersMapper.MapToDto(stat.User),
            Revenue = stat.Revenue,
        };
    }

    public IEnumerable<UserRevenueStatisticDto> MapToUserRevenueDtoList(IEnumerable<UserRevenueStatistic> stats)
    {
        return stats.Select(s => MapToUserRevenueDto((s)));
    }

    public UserYearStatDto MapToUserYearStatDto(UserYearStatistic userYearStatistics)
    {
        return new UserYearStatDto
        {
            Year = userYearStatistics.Year,
            Count = userYearStatistics.Count,
        };
    }

    public IEnumerable<UserYearStatDto> MapToUserYearStatDtoList(IEnumerable<UserYearStatistic> userYearStatistics)
    {
        return userYearStatistics.Select(u =>  MapToUserYearStatDto((u)));
    }
}
