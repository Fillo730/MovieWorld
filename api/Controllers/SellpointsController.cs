namespace MovieWorld.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MovieWorld.Dtos;
using MovieWorld.DTOs;
using MovieWorld.IServices;
using MovieWorld.Services;

[ApiController]
[Route("api/[controller]")]
public class SellpointsController(ISellPointsService sellPointsService) : BaseController
{
    private readonly ISellPointsService _sellPointsService = sellPointsService;

    [HttpGet]
    public async Task<IActionResult> GetSellPoints([FromQuery] SellPointsFilterDto filters, [FromQuery] string? lang, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var sellPoints = await _sellPointsService.GetSellPointsAsync(filters,GetCurrentLanguage(lang), pageIndex, pageSize);

            return Ok(ApiResponse<PagedResult<SellPointDto>>.CreateSuccessResponse(sellPoints));
        }
        catch(Exception ex)
        {
            return Ok(ApiResponse<SellPointDto>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("cities")]
    public async Task<IActionResult> GetCities([FromQuery] string? lang)
    {
        
        try
        {
            var cities = await _sellPointsService.GetCitiesAsync(GetCurrentLanguage(lang));

            return Ok(ApiResponse<IEnumerable<string>>.CreateSuccessResponse(cities));
        }
        catch(Exception e)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(e.Message));
        }
    }

    [HttpGet("nearest")]
    public async Task<IActionResult> GetNearestSellPoints([FromQuery] double userLat, [FromQuery] double userLng, [FromQuery] int limit = 5, [FromQuery] string? lang = null)
    {
        try
        {
            var sellPoints = await _sellPointsService.GetNearestSellPointsAsync(userLat, userLng, limit, GetCurrentLanguage(lang));

            return Ok(ApiResponse<IEnumerable<SellPointDto>>.CreateSuccessResponse(sellPoints));
        }
        catch(Exception e)
        {
            return Ok(ApiResponse<SellPointDto>.CreateFailureResponse(e.Message));
        }
    }

    [HttpGet("bymovies")]
    public async Task<IActionResult> GetSellPointsByMovies([FromQuery] SellPointsWithMoviesRequest request,  [FromQuery] string? lang = null)
    {
        try
        {
            Console.WriteLine(request.UserLat + " " + request.UserLng);
            var sellPoints = await _sellPointsService.GetSellPointsByMoviesAsync(request.MovieIds, request.PageIndex, request.PageSize, GetCurrentLanguage(lang), request.UserLat, request.UserLng);

            return Ok(ApiResponse<PagedResult<SellPointDto>>.CreateSuccessResponse(sellPoints));
        }
        catch(Exception e)
        {
            return Ok(ApiResponse<PagedResult<SellPointDto>>.CreateFailureResponse(e.Message));
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> GetSellPointsByQuery([FromQuery] string query, [FromQuery] string? lang = null, [FromQuery] int limit = 10)
    {
        try
        {
            var sellPoints = await _sellPointsService.GetSellPointsByQuery(query, GetCurrentLanguage(lang), limit);

            return Ok(ApiResponse<IEnumerable<SellPointDto>>.CreateSuccessResponse(sellPoints));
        }
        catch(Exception e)
        {
            return Ok(ApiResponse<SellPointDto>.CreateFailureResponse(e.Message));
        }
    }

    [Authorize]
    [HttpGet("export")]
    public async Task<IActionResult> ExportMoviesToExcel([FromQuery] SellPointsFilterDto sellPointsFilters, [FromQuery] string? lang)
    {
        var result = await _sellPointsService.GetSellPointsAsync(sellPointsFilters, GetCurrentLanguage(lang));

        var fileContent = ExcelHelper.GenerateExcelFile<SellPointDto>(result.Items.ToList(), SellPointDto.GetExcellHeaders(), "SellPoints");

        return File(
            fileContent,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "MoviesList.xlsx");
    }

}
