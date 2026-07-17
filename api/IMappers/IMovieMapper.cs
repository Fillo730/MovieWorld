using MovieWorld.Dtos;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface IMovieMapper
{
    IEnumerable<MovieDto> MapToDtoList(IEnumerable<Movie> movies, string currentLang);
    MovieDto MapToDto(Movie movie, string currentLang);

    Movie MapToDb(MovieDto movieDto, string currentLang);

    GenreDto MapGenreToDto(GenreTranslation genre, string currentLang);

    void MapUpdateToDb(MovieDto movieDto, Movie movie, string currentLang);

    IEnumerable<GenreDto> MapGenreToDtoList(IEnumerable<GenreTranslation> genres, string currentLang);

    FormatDto MapFormatToDto(Format format);

    IEnumerable<FormatDto> MapFormatToDtoList(IEnumerable<Format> formats);
}