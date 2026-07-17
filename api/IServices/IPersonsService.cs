using MovieWorld.Dtos;

namespace MovieWorld.IServices;

public interface IPersonsService
{
    public Task<IEnumerable<PersonDto>> GetPersonByQueryAsync(string query);

    public Task<PagedResult<PersonDto>> GetAllPersonsAsync(int pageIndex, int pageSize, string lang, PersonFilterDto filters);

    public Task<PersonDto> CreatePersonAsync(PersonDto personDto);

    public Task<PersonDto?> UpdatePersonAsync(PersonDto personDto);

    public Task<int> GetTotalPersonsCountAsync();

    public Task<int> GetActorsCountAsync();

    public Task<int> GetDirectorsCountAsync();

    public Task<bool> DeletePersonAsync(int personId);
}
