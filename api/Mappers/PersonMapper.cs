namespace MovieWorld.Mappers;

using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.Models;
using MovieWorld.Repositories;
using System.Collections.Generic;

public class PersonMapper : IPersonMapper
{

    public Person MapToDb(PersonDto personDto)
    {
        if (personDto is null) return null;
        return new Person
        {
            PersonId = personDto.PersonId,
            Name = personDto.FullName.Split(' ')[0],
            Surname = personDto.FullName.Contains(' ') ? personDto.FullName.Substring(personDto.FullName.IndexOf(' ') + 1) : string.Empty,
            ImagePath = personDto.ImagePath
        };
    }

    public PersonDto MapToDto(Person person)
    {
        if(person is null) return null;
        return new PersonDto
        {
            PersonId = person.PersonId,
            FullName = $"{person.Name} {person.Surname}",
            ImagePath = person.ImagePath
        };
    }

    public IEnumerable<PersonDto> MapToListDto(IEnumerable<Person> persons)
    {
        var personDtos = new List<PersonDto>();
        foreach (var person in persons)
        {
            personDtos.Add(MapToDto(person));
        }
        return personDtos;
    }

    public IEnumerable<Person> MapToListDto(IEnumerable<PersonDto> persons)
    {
        var personEntities = new List<Person>();

        foreach (var personDto in persons)
        {
            personEntities.Add(MapToDb(personDto));
        }

        return personEntities;
    }
}
