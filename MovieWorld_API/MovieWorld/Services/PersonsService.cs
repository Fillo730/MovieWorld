using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;

namespace MovieWorld.Services;

public class PersonsService (IPersonRepository personRepository, IPersonMapper personMapper, IPagedMapper pageMapper) : IPersonsService
{
    private readonly IPersonRepository _personRepository = personRepository;

    private readonly IPersonMapper _personMapper = personMapper;

    private readonly IPagedMapper _pageMapper = pageMapper;

    public async Task<PersonDto> CreatePersonAsync(PersonDto personDto)
    {
        var person = _personMapper.MapToDb(personDto);

        await _personRepository.CreatePersonAsync(person);

        await _personRepository.SaveChangesAsync();

        return _personMapper.MapToDto(person);
    }

    public async Task<bool> DeletePersonAsync(int personId)
    {
        var person =  await _personRepository.GetPersonByIdAsync(personId);

        if(person is null)
        {
            return false;
        }

        _personRepository.DeletePerson(person);

        await _personRepository.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<PersonDto>> GetPersonByQueryAsync(string query)
    {
        var persons = await _personRepository.GetPersonByQueryAsync(query);

        return _personMapper.MapToListDto(persons);
    }

    public async Task<PersonDto?> UpdatePersonAsync(PersonDto personDto)
    {
        var person = await _personRepository.GetPersonByIdAsync(personDto.PersonId);

        if(person == null) 
        {
            return null;
        }

        person.Name = personDto.FullName.Split(' ')[0];
        person.Surname = personDto.FullName.Split(' ').Length > 1 ? personDto.FullName.Split(' ')[1] : "";
        person.ImagePath = personDto.ImagePath ?? "";

        await _personRepository.SaveChangesAsync();

        return _personMapper.MapToDto(person);
    }

    public async Task<PagedResult<PersonDto>> GetAllPersonsAsync(int pageIndex, int pageSize, string lang, PersonFilterDto filters)
    {
        var (persons, totalCount) = await _personRepository.GetAllPersonsAsync(pageIndex, pageSize, lang, filters);

        return _pageMapper.MapToPagedResult(persons, totalCount, pageIndex, pageSize, 
            person => _personMapper.MapToDto(person));
    }

    public async Task<int> GetTotalPersonsCountAsync()
    {
        return await _personRepository.GetTotalPersonsCountAsync();
    }

    public async Task<int> GetActorsCountAsync()
    {
        return await _personRepository.GetActorsNumberCountAsync();
    }

    public async Task<int> GetDirectorsCountAsync()
    {
        return await _personRepository.GetDirectorsCountAsync();
    }
}
