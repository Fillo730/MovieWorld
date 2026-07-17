using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController(IOrdersService ordersService) : BaseController
{
    private readonly IOrdersService _ordersService = ordersService;

    [HttpGet]
    public async Task<IActionResult> GetAllOrdersAsync([FromQuery] OrdersFilterDto filters, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string? lang = null)
    {
        try
        {
            var result = await _ordersService.GetAllOrdersAsync(pageIndex, pageSize, filters, GetCurrentLanguage(lang));
            return Ok(ApiResponse<PagedResult<OrderDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> GetAllUsersOrdersAsync([FromQuery] OrdersFilterDto filters, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string? lang = null)
    {
        try
        {
            var result = await _ordersService.GetUserOrdersAsync(GetUserIdFromToken(), pageIndex, pageSize, filters, GetCurrentLanguage(lang));

            return Ok(ApiResponse<PagedResult<OrderDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    public async Task<IActionResult> DeleteAsync([FromBody] OrderDto order)
    {
        try
        {
            var success = await _ordersService.DeleteAsync(order);
            if (!success) return Ok(ApiResponse<string>.CreateFailureResponse("Order not found"));

            return Ok(ApiResponse<string>.CreateSuccessResponse("Order deleted successfully"));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddAsync([FromBody] OrderDto order, [FromQuery] string? lang)
    {
        try
        {
            var result = await _ordersService.AddAsync(order, GetCurrentLanguage(lang));
            return Ok(ApiResponse<OrderDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("states")]
    public async Task<IActionResult> GetAllOrderStatesAsync([FromQuery] string? lang)
    {
        try
        {
            var result = await _ordersService.GetAllOrderStatesAsync(GetCurrentLanguage(lang));
            return Ok(ApiResponse<IEnumerable<OrderStateDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync([FromBody] OrderDto order, [FromQuery] string? lang, [FromRoute] int id)
    {
        try
        {
            if (id != order.Id)
            {
                return Ok(ApiResponse<string>.CreateFailureResponse("Ids in the request are not the same"));
            }

            var result = await _ordersService.UpdateAsync(order, GetCurrentLanguage(lang));
            return Ok(ApiResponse<OrderDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetOrderCountAsync()
    {
        try
        {
            var result = await _ordersService.GetOrdersCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("countCompleted")]
    public async Task<IActionResult> GetCompletedOrdersCount()
    {
        try
        {
            var result = await _ordersService.GetOrdersCompletedCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/revenueByYear")]
    public async Task<IActionResult> GetRevenueForEveryYearAsync()
    {
        try
        {
            var result = await _ordersService.GetRevenueForEvertYearAsync();

            return Ok(ApiResponse<IEnumerable<RevenuePerYearStatisticDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/ordersPerOrderState")]
    public async Task<IActionResult> GetOrdersPerOrderStateAsync([FromQuery] string? lang)
    {
        try
        {
            var result = await _ordersService.GetOrdersPerOrderStateAsync(GetCurrentLanguage(lang));

            return Ok(ApiResponse<IEnumerable<OrdersPerOrderStateStatisticDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }
}