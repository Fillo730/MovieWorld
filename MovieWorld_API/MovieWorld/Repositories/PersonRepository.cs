using Microsoft.EntityFrameworkCore;
using MovieWorld.Constants;
using MovieWorld.Dtos;
using MovieWorld.IRepositories;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class PersonRepository : BaseRepository, IPersonRepository
{
    public PersonRepository(TrainingBrattiContext dbContext) : base(dbContext)
    {

    }

    public async Task<Person> CreatePersonAsync(Person person)
    {
        await _dbContext.People.AddAsync(person);

        return person;
    }

    public void DeletePerson(Person person)
    {
        _dbContext.People.Remove(person);
    }

    public async Task<int> GetActorsNumberCountAsync()
    {
        return await _dbContext.People.Where(p => p.MoviePeople.Any(mp => mp.Role == "Actor")).CountAsync();
    }

    public async Task<(IEnumerable<Person> Persons, int TotalCount)> GetAllPersonsAsync(int pageIndex, int pageSize, string lang, PersonFilterDto filters)
    {
        var query = _dbContext.People.AsQueryable();

        if (!string.IsNullOrEmpty(filters.Query))
        {
            var pattern = $"%{filters.Query}%";
            query = query.Where(p =>
                EF.Functions.Like(p.Name, pattern) ||
                EF.Functions.Like(p.Surname, pattern) ||
                EF.Functions.Like(p.Name + " " + p.Surname, pattern));
        }

        if (!string.IsNullOrEmpty(filters.Role))
        {
            query = query.Where(p => p.MoviePeople.Any(mp => mp.Role == filters.Role));
        }

        int totalCount = await query.CountAsync();

        var result = await query
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (result, totalCount);
    }

    public async Task<int> GetDirectorsCountAsync()
    {
        return await _dbContext.People.Where(p => p.MoviePeople.Any(mp => mp.Role == "Director")).CountAsync();
    }

    public async Task<Person?> GetPersonByIdAsync(int personId)
    {
        var person = await _dbContext.People.FindAsync(personId);

        return person;
    }

    public async Task<IEnumerable<Person>> GetPersonByQueryAsync(string query)
    {
        var pattern = $"%{query}%";
        return await _dbContext.People
        .AsNoTracking()
        .Where(p =>
            EF.Functions.Like(p.Name, pattern) ||
            EF.Functions.Like(p.Surname, pattern) ||
            EF.Functions.Like(p.Name + " " + p.Surname, pattern))
        .OrderBy(p => p.Name)
        .Take(15)
        .ToListAsync();
    }

    public async Task<int> GetTotalPersonsCountAsync()
    {
        return await _dbContext.People.CountAsync();
    }
}
