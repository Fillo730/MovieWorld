using Microsoft.AspNetCore.Identity;
using MovieWorld.Models;
using MovieWorld.Constants;
using MovieWorld.Dtos;

namespace MovieWorld.IRepositories;

public interface IPersonRepository
{
    Task<IEnumerable<Person>> GetPersonByQueryAsync(string query);

    Task<(IEnumerable<Person> Persons, int TotalCount)> GetAllPersonsAsync(int pageIndex, int pageSize, string lang, PersonFilterDto filters);

    Task<Person> CreatePersonAsync(Person person);

    void DeletePerson(Person person);

    Task<Person?> GetPersonByIdAsync(int personId);

    Task<int> GetTotalPersonsCountAsync();

    Task<int> GetActorsNumberCountAsync();

    Task<int> GetDirectorsCountAsync();

    Task SaveChangesAsync();
}
