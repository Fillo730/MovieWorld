using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;
using MovieWorld.Models;


namespace MovieWorld.Services;

public class UsersService(IUserRepository userRepository, IUsersMapper usersMapper, IPagedMapper pagedMapper,
    IStatisticsMapper statisticsMapper) : IUsersService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUsersMapper _usersMapper = usersMapper;
    private readonly IPagedMapper _pagedMapper = pagedMapper;
    private readonly IStatisticsMapper _statisticsMapper = statisticsMapper;

    public async Task<UserDto> CreateUserAsync(UserDto user)
    {
        var userDb = _usersMapper.MapToDb(user);

        var createdUser = await _userRepository.CreateUserAsync(userDb);

        await _userRepository.SaveChangesAsync();

        return _usersMapper.MapToDto(createdUser);
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);

        if (user != null)
        {
            await _userRepository.DeleteUserAsync(user);

            await _userRepository.SaveChangesAsync();

            return true;
        }
        else
        {
            return false;
        }
    }

    public Task<int> GetAdminsCountAsync()
    {
        return _userRepository.GetAdminsCountAsync();
    }

    public async Task<PagedResult<UserDto>> GetAllUsers(int pageIndex, int pageSize, UsersFilterDto filters)
    {
        var (users, totalCount) = await _userRepository.GetAllUsers(pageIndex, pageSize, filters);

        return _pagedMapper.MapToPagedResult(users, totalCount, pageIndex, pageSize, user => _usersMapper.MapToDto(user));
    }

    public async Task<int> GetInactiveUsersCountAsync(int monthNumber)
    {
        return await _userRepository.GetInactiveUsersCountAsync(monthNumber);
    }

    public async Task<decimal> GetOrdersPerUserRatioAsync()
    {
        return await _userRepository.GetOrdersPerUserRatioAsync();
    }

    public Task<int> GetStandardUsersCountAsync()
    {
        return _userRepository.GetStandardUsersCountAsync();
    }

    public async Task<IEnumerable<UserRevenueStatisticDto>> GetTopSpedingUsersAsync(int count)
    {
        var result = await _userRepository.GetTopSpedingUsersAsync(count);

        return _statisticsMapper.MapToUserRevenueDtoList(result);
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _userRepository.GetTotalUsersCountAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);

        if (user is null)
        {
            return null;
        }

        return _usersMapper.MapToDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetUserByQueryAsync(string query, int limit)
    {
        var users = await _userRepository.GetUserByQueryAsync(query, limit);

        return _usersMapper.MapToDtoList(users);
    }

    public async Task<IEnumerable<UserYearStatDto>> GetUsersCountForEveryYear()
    {
        var result = await _userRepository.GetUsersCountForYearAsync();

        return _statisticsMapper.MapToUserYearStatDtoList(result);
    }

    public async Task<IEnumerable<UserMonthStatisticDto>> GetUsersCountForMonthLastMonthsAsync(int months)
    {
        var result = await _userRepository.GetUsersCountForMonthLastMonthsAsync(months);

        return _statisticsMapper.MapToUserMonthStatisticDtoList(result);
    }

    public async Task<UserDto?> UpdateUserAsync(UserDto user)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(user.UserId);

        if (existingUser is null)
        {
            return null;
        }

       _usersMapper.MapUpdateToDb(user, existingUser);

        await _userRepository.SaveChangesAsync();

        return _usersMapper.MapToDto(existingUser);
    }
}