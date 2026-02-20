namespace MovieWorld.Controllers;

using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Constants;
using MovieWorld.Dtos;
using MovieWorld.IServices;

[ApiController]
[Route("api/[controller]")]
public class MoviesController(IMovieService movieService) : BaseController
{
    private readonly IMovieService _movieService = movieService;

    [HttpGet]
    public async Task<IActionResult> GetMovies([FromQuery] MovieFilterDto movieFilters, [FromQuery] string? lang, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {

            var movies = await _movieService.GetMoviesAsync(GetCurrentLanguage(lang), movieFilters, pageIndex, pageSize);
            return Ok(ApiResponse<PagedResult<MovieDto>>.CreateSuccessResponse(movies));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<MovieDto>>.CreateFailureResponse($"Errore nel recupero film: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMovieById(int id, [FromQuery] string? lang)
    {
        try
        {
            var movie = await _movieService.GetMovieByIdAsync(id, GetCurrentLanguage(lang));
            if (movie is null)
                return Ok(ApiResponse<MovieDto>.CreateFailureResponse("Movie not found"));

            return Ok(ApiResponse<MovieDto>.CreateSuccessResponse(movie));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<MovieDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieDto movieDto, [FromQuery] string? lang)
    {
        try
        {
            var updatedMovie = await _movieService.UpdateMovieAsync(id, movieDto, GetCurrentLanguage(lang));
            if (updatedMovie is null)
                return Ok(ApiResponse<MovieDto>.CreateFailureResponse("Movie not found"));

            return Ok(ApiResponse<MovieDto>.CreateSuccessResponse(updatedMovie));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<MovieDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateMovie([FromBody] MovieDto movieDto, [FromQuery] string? lang)
    {
        try
        {
            var createdMovie = await _movieService.CreateMovieAsync(movieDto, GetCurrentLanguage(lang));

            return Ok(ApiResponse<MovieDto>.CreateSuccessResponse(createdMovie));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<MovieDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovieById(int id)
    {
        try
        {
            var success = await _movieService.DeleteMovieAsync(id);
            if (success)
                return Ok(ApiResponse<string>.CreateSuccessResponse("Movie deleted successfully"));

            return Ok(ApiResponse<string>.CreateFailureResponse("Movie not found"));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<string>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("cult")]
    public async Task<IActionResult> GetCultMovies([FromQuery] string? lang, [FromQuery] int? quantity)
    {
        try
        {
            var cultMovies = await _movieService.GetCultMoviesAsync(GetCurrentLanguage(lang), quantity ?? AppConstants.DefaultMoviesCultNumber);
            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateSuccessResponse(cultMovies));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetMoviesCount()
    {
        try
        {
            var count = await _movieService.GetTotalCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("related/{id}")]
    public async Task<IActionResult> GetMoviesWithSameGenre(int id, [FromQuery] string? lang, [FromQuery] int? quantity)
    {
        try
        {
            var relatedMovies = await _movieService.GetMoviesWithSameGenre(id, quantity ?? AppConstants.DefaultMoviesWithSameGenreNumber, GetCurrentLanguage(lang));
            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateSuccessResponse(relatedMovies));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("genres")]
    public async Task<IActionResult> GetGenres([FromQuery] string? lang)
    {
        try
        {
            var genres = await _movieService.GetGenresAsync(GetCurrentLanguage(lang));
            return Ok(ApiResponse<IEnumerable<GenreDto>>.CreateSuccessResponse(genres));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<GenreDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("formats")]
    public async Task<IActionResult> GetFormats()
    {
        try
        {
            var formats = await _movieService.GetFormatsAsync();
            return Ok(ApiResponse<IEnumerable<FormatDto>>.CreateSuccessResponse(formats));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<FormatDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchMovies([FromQuery] string query, [FromQuery] string? lang, [FromQuery] int limit)
    {
        try
        {
            var movies = await _movieService.GetMoviesByQueryAsync(query, GetCurrentLanguage(lang), limit);

            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateSuccessResponse(movies));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<MovieDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("count/cult")]
    public async Task<IActionResult> GetCultMoviesCountAsync()
    {
        try
        {
            var count = await _movieService.GetCultMoviesCountAsync();
            return Ok(ApiResponse<int>.CreateSuccessResponse(count));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats/genres")]
    public async Task<IActionResult> GetMoviesCountForEveryGenre([FromQuery] string? lang)
    {
        try
        {
            var result = await _movieService.GetMoviesCountForEveryGenre(GetCurrentLanguage(lang));

            return Ok(ApiResponse<IEnumerable<GenreStatDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<GenreStatDto>>.CreateFailureResponse(ex.Message));
        }

    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportMoviesToExcel([FromQuery] MovieFilterDto movieFilters, [FromQuery] string? lang)
    {
        var result = await _movieService.GetMoviesAsync(GetCurrentLanguage(lang), movieFilters);

        var fileContent = ExcelHelper.GenerateExcelFile<MovieDto>(result.Items.ToList(), MovieDto.GetExcelHeaders(), "Movies");

        return File(
            fileContent,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "MoviesList.xlsx");
    }
}