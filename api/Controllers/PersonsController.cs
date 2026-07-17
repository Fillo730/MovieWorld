using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;

namespace MovieWorld.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonsController(IPersonsService personsService) : BaseController
{
    private readonly IPersonsService _personsService = personsService;

    [HttpGet]
    public async Task<IActionResult> GetAllPersons([FromQuery] PersonFilterDto filters, [FromQuery] string? lang, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _personsService.GetAllPersonsAsync(pageIndex, pageSize, GetCurrentLanguage(lang), filters);
            
            return Ok(ApiResponse<PagedResult<PersonDto>>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PagedResult<PersonDto>>.CreateFailureResponse($"Errore nel recupero del cast: {ex.Message}"));
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> GetPersonsByQuery([FromQuery] string query)
    {
        try
        {
            var persons = await _personsService.GetPersonByQueryAsync(query);
            return Ok(ApiResponse<IEnumerable<PersonDto>>.CreateSuccessResponse(persons));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<IEnumerable<PersonDto>>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreatePerson([FromBody] PersonDto personDto)
    {
        try
        {
            var createdPerson = await _personsService.CreatePersonAsync(personDto);
            return Ok(ApiResponse<PersonDto>.CreateSuccessResponse(createdPerson));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PersonDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> UpdatePerson([FromBody] PersonDto personDto)
    {
        try
        {
            var updatedPerson = await _personsService.UpdatePersonAsync(personDto);

            if (updatedPerson is null)
            {
                return Ok(ApiResponse<PersonDto>.CreateFailureResponse("Person not found"));
            }
            return Ok(ApiResponse<PersonDto>.CreateSuccessResponse(updatedPerson));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<PersonDto>.CreateFailureResponse(ex.Message));
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            var isDeleted = await _personsService.DeletePersonAsync(id);
            if (!isDeleted)
            {
                return Ok(ApiResponse<bool>.CreateFailureResponse("Person not found"));
            }
            return Ok(ApiResponse<bool>.CreateSuccessResponse(true));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<bool>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("counts/total")]
    public async Task<IActionResult> GetTotalPersonsCountAsync()
    {
        try
        {
            var result = await _personsService.GetTotalPersonsCountAsync();

            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("counts/actor")]
    public async Task<IActionResult> GetActorsCountAsync()
    {
        try
        {
            var result = await _personsService.GetActorsCountAsync();

            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }

    [HttpGet("counts/director")]
    public async Task<IActionResult> GetDirectorsCountAsync()
    {
        try
        {
            var result = await _personsService.GetDirectorsCountAsync();

            return Ok(ApiResponse<int>.CreateSuccessResponse(result));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.CreateFailureResponse(ex.Message));
        }
    }
}