using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController(INewsService newsService) : BaseController
{
    private readonly INewsService _newsService = newsService;

    [HttpGet]
    public async Task<IActionResult> GetNews([FromQuery] NewsFilters filters, [FromQuery] string? lang, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var news = await _newsService.GetNewsAsync(pageIndex, pageSize, filters, GetCurrentLanguage(lang));
            return Ok(ApiResponse<PagedResult<NewsDto>>.CreateSuccessResponse(news));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<NewsDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNewsById(int id, [FromQuery] string? lang)
    {
        try
        {
            var news = await _newsService.GetNewsByIdAsync(id, GetCurrentLanguage(lang));
            if (news == null) return Ok(ApiResponse<NewsDto>.CreateFailureResponse("Notizia non trovata"));

            return Ok(ApiResponse<NewsDto>.CreateSuccessResponse(news));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<NewsDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddNews([FromBody] NewsDto newsDto, [FromQuery] string? lang)
    {
        try
        {
            var result = await _newsService.AddNewsAsync(newsDto, GetCurrentLanguage(lang));
            return Ok(ApiResponse<NewsDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<NewsDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> UpdateNews([FromBody] NewsDto newsDto, [FromQuery] string? lang)
    {
        try
        {
            var result = await _newsService.UpdateNewsAsync(newsDto, GetCurrentLanguage(lang));

            if (result == null) return Ok(ApiResponse<NewsDto>.CreateFailureResponse("Impossibile aggiornare: notizia non trovata"));

            return Ok(ApiResponse<NewsDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<NewsDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNews(int id, [FromQuery] string? lang)
    {
        try
        {
            var result = await _newsService.DeleteNewsAsync(id, GetCurrentLanguage(lang));
            if (result == null) return Ok(ApiResponse<NewsDto>.CreateFailureResponse("Impossibile eliminare: notizia non trovata"));

            return Ok(ApiResponse<NewsDto>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<NewsDto>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetNewsCount()
    {
        try
        {
            var result = await _newsService.GetNewsCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }
}