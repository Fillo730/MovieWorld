using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;
using MovieWorld.Models;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUsersService usersService) : BaseController
{
    private readonly IUsersService _usersService = usersService;

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers([FromQuery] UsersFilterDto filters, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _usersService.GetAllUsers(pageIndex, pageSize, filters);
            return Ok(ApiResponse<PagedResult<UserDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<UserDto>>.CreateFailureResponse($"Errore nel recupero utenti: {ex.Message}"));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserDto user)
    {
        try
        {
            var createdUser = await _usersService.CreateUserAsync(user);
            return Ok(ApiResponse<UserDto>.CreateSuccessResponse(createdUser));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<UserDto>.CreateFailureResponse($"Errore durante la creazione utente: {ex.Message}"));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateUser(int userId, [FromBody] UserDto user)
    {
        try
        {
            if (userId != user.UserId)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse("User ID mismatch."));
            }

            var updatedUser = await _usersService.UpdateUserAsync(user);

            if (updatedUser is null)
            {
                return Ok(ApiResponse<UserDto>.CreateFailureResponse("User not found."));
            }

            return Ok(ApiResponse<UserDto>.CreateSuccessResponse(updatedUser));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<UserDto>.CreateFailureResponse($"Errore durante l'aggiornamento: {ex.Message}"));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUser(int userId)
    {
        try
        {
            var success = await _usersService.DeleteUserAsync(userId);
            if (!success)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse("User not found."));
            }
            return Ok(ApiResponse<string>.CreateSuccessResponse("User deleted successfully."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse($"Errore durante l'eliminazione: {ex.Message}"));
        }
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateOwnProfile([FromBody] UpdateProfileDto profile)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var updatedUser = await _usersService.UpdateOwnProfileAsync(userId, profile);

            if (updatedUser is null)
            {
                return Ok(ApiResponse<UserDto>.CreateFailureResponse("User not found."));
            }

            return Ok(ApiResponse<UserDto>.CreateSuccessResponse(updatedUser));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<UserDto>.CreateFailureResponse($"Errore durante l'aggiornamento: {ex.Message}"));
        }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(int userId)
    {
        try
        {
            var user = await _usersService.GetUserByIdAsync(userId);
            if (user is null)
            {
                return Ok(ApiResponse<UserDto>.CreateFailureResponse("User not found."));
            }
            return Ok(ApiResponse<UserDto>.CreateSuccessResponse(user));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<UserDto>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("counts/standard")]
    public async Task<IActionResult> GetStandardUsersCount()
    {
        try
        {
            var count = await _usersService.GetStandardUsersCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("counts/admins")]
    public async Task<IActionResult> GetAdminsCount()
    {
        try
        {
            var count = await _usersService.GetAdminsCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] string query, [FromQuery] int limit = 10)
    {
        try
        {
            var users = await _usersService.GetUserByQueryAsync(query, limit);

            return Ok(ApiResponse<IEnumerable<UserDto>>.CreateSuccessResponse(users));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<UserDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/year")]
    public async Task<IActionResult> GetUsersCountForEveryYear()
    {
        try
        {
            var result = await _usersService.GetUsersCountForEveryYear();

            return Ok(ApiResponse<IEnumerable<UserYearStatDto>>.CreateSuccessResponse(result));
        }
        catch(Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<UserYearStatDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/topUsersSpending")]
    public async Task<IActionResult> GetTopSpendingUsersAsync([FromQuery] int count)
    {
        try
        {
            var result = await _usersService.GetTopSpedingUsersAsync(count);

            return Ok(ApiResponse<IEnumerable<UserRevenueStatisticDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/ordersPerUserRatio")]
    public async Task<IActionResult> GetOrdersPerUserRatioAsync()
    {
        try
        {
            var result = await _usersService.GetOrdersPerUserRatioAsync();

            return Ok(ApiResponse<decimal>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/inactiveUsersCount")]
    public async Task<IActionResult> GetInactiveUsersCountAsync([FromQuery] int monthNumber)
    {
        try
        {
            var result = await _usersService.GetInactiveUsersCountAsync(monthNumber);

            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/usersForMonthThisYear")]
    public async Task<IActionResult> GetUsersCountForMonthForThisYearAsync([FromQuery] int months)
    {
        try
        {
            var result = await _usersService.GetUsersCountForMonthLastMonthsAsync(months);

            return Ok(ApiResponse<IEnumerable<UserMonthStatisticDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }


    [HttpGet("counts/total")]
    public async Task<IActionResult> GetTotalUsersCount()
    {
        try
        {
            var count = await _usersService.GetTotalUsersCountAsync();

            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch(Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }
}