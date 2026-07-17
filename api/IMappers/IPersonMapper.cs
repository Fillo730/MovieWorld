using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IPersonMapper
{
    PersonDto MapToDto(Person person);
    IEnumerable<PersonDto> MapToListDto(IEnumerable<Person> persons);

    Person MapToDb(PersonDto personDto);

    IEnumerable<Person> MapToListDto(IEnumerable<PersonDto> persons);
}
