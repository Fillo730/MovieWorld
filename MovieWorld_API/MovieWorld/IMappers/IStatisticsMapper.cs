using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IStatisticsMapper
{
    IEnumerable<GenreStatDto> MapToGenreStatDtoList(IEnumerable<GenreStatistics> genreStatistics);

    GenreStatDto MapToGenreStatDto (GenreStatistics genreStatDto);

    IEnumerable<UserYearStatDto> MapToUserYearStatDtoList(IEnumerable<UserYearStatistic> userYearStatistics);

    UserYearStatDto MapToUserYearStatDto(UserYearStatistic userYearStatistics);

    IEnumerable<RevenuePerYearStatisticDto> MapToRevenuePerYearDtoList(IEnumerable<RevenuePerYearStatistic> stats);

    RevenuePerYearStatisticDto MapToRevenuePerYearDto(RevenuePerYearStatistic stat);

    IEnumerable<UserRevenueStatisticDto> MapToUserRevenueDtoList(IEnumerable<UserRevenueStatistic> stats);

    UserRevenueStatisticDto MapToUserRevenueDto(UserRevenueStatistic stat);

    IEnumerable<UserMonthStatisticDto> MapToUserMonthStatisticDtoList(IEnumerable<UserMonthStatistic> stats);

    UserMonthStatisticDto MapToUserMonthStatisticDto(UserMonthStatistic stat);

    IEnumerable<OrdersPerOrderStateStatisticDto> MapToOrdersPerOrderStateDtoList(IEnumerable<OrdersPerOrderStateStatistic> stats);

    OrdersPerOrderStateStatisticDto MapToOrdersPerOrderStateDto (OrdersPerOrderStateStatistic stat);
}
