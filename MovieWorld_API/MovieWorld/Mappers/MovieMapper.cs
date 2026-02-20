using MovieWorld.Dtos;
using MovieWorld.Models;
using MovieWorld.IMappers;

namespace MovieWorld.Mappers;

public class MovieMapper : IMovieMapper
{
    public IEnumerable<MovieDto> MapToDtoList(IEnumerable<Movie> movies, string currentLang)
    {
        return movies.Select(m => MapToDto(m, currentLang)).ToList();
    }

    public MovieDto MapToDto(Movie movie, string currentLang)
    {
        return new MovieDto
        {
            MovieId = movie.MovieId,
            Title = movie.MovieTranslations?
                .FirstOrDefault(mt => mt.LanguageCode == currentLang)?.Title ?? "N/A",
            Story = movie.MovieTranslations?
                .FirstOrDefault(mt => mt.LanguageCode == currentLang)?.Story ?? "No description available",
            Cost = movie.Cost ?? 0,
            Year = movie.Year ?? 0,
            ImagePath = movie.ImagePath,
            TrailerUrl = movie.TrailerUrl,
            IsCult = movie.IsCult ?? false,
            Director = movie.MoviePeople?
                .Where(mp => mp.Role == "Director")
                .Select(mp => new PersonDto
                {
                    PersonId = mp.Person.PersonId,
                    FullName = mp.Person.Name + " " + mp.Person.Surname,
                    ImagePath = mp.Person.ImagePath
                }).FirstOrDefault(),
            Actors = movie.MoviePeople?
                .Where(mp => mp.Role == "Actor")
                .Select(mp => new PersonDto
                {
                    PersonId = mp.Person.PersonId,
                    FullName = mp.Person.Name + " " + mp.Person.Surname,
                    ImagePath = mp.Person.ImagePath
                }).ToList() ?? new List<PersonDto>(),
            Genres = movie.MovieGenres?.Select(mg => new GenreDto
            {
                Id = mg.GenreId,
                Name = mg.Genre?.GenreTranslations?
                    .FirstOrDefault(gt => gt.LanguageCode == currentLang)?.Name ?? "N/A"
            }).ToList() ?? new List<GenreDto>(),
            Format = new FormatDto
            {
                Id = movie.Format?.FormatId ?? 0,
                Name = movie.Format?.Name ?? "N/A"
            }
        };
    }

    public Movie MapToDb(MovieDto movieDto, string currentLang)
    {
        var movie = new Movie
        {
            MovieId = movieDto.MovieId,
            Cost = movieDto.Cost,
            Year = movieDto.Year,
            ImagePath = movieDto.ImagePath,
            TrailerUrl = movieDto.TrailerUrl,
            IsCult = movieDto.IsCult,
            FormatId = movieDto.Format.Id
        };

        movie.MovieTranslations = new List<MovieTranslation>
        {
            new MovieTranslation
            {
                Title = movieDto.Title,
                Story = movieDto.Story,
                LanguageCode = currentLang
            }
        };

        movie.MovieGenres = movieDto.Genres.Select(g => new MovieGenre
        {
            GenreId = g.Id
        }).ToList();

        return movie;
    }

    public GenreDto MapGenreToDto(GenreTranslation genre, string currentLang)
    {
        return new GenreDto
        {
            Id = genre.GenreId,
            Name = genre.Name,
        };
    }

    public IEnumerable<GenreDto> MapGenreToDtoList(IEnumerable<GenreTranslation> genres, string currentLang)
    {
        return genres.Select(g => MapGenreToDto(g, currentLang)).ToList();
    }

    public FormatDto MapFormatToDto(Format format)
    {
        return new FormatDto
        {
            Id = format.FormatId,
            Name = format.Name
        };
    }

    public IEnumerable<FormatDto> MapFormatToDtoList(IEnumerable<Format> formats)
    {
        return formats.Select(MapFormatToDto).ToList();
    }

    public void MapUpdateToDb(MovieDto movieDto, Movie movie, string currentLang)
    {
        movie.Cost = movieDto.Cost;
        movie.Year = movieDto.Year;
        movie.TrailerUrl = movieDto.TrailerUrl;
        movie.IsCult = movieDto.IsCult;
        movie.ImagePath = movieDto.ImagePath;
        movie.FormatId = movieDto.Format.Id;

        movie.MovieGenres.Clear();
        foreach (var genreDto in movieDto.Genres)
        {
            movie.MovieGenres.Add(new MovieGenre
            {
                MovieId = movie.MovieId,
                GenreId = genreDto.Id
            });
        }

        var translation = movie.MovieTranslations.FirstOrDefault(t => t.LanguageCode == currentLang);
        if (translation == null)
        {
            translation = new MovieTranslation
            {
                LanguageCode = currentLang,
                MovieId = movie.MovieId
            };
            movie.MovieTranslations.Add(translation);
        }

        movie.MoviePeople.Clear();
        if (movieDto.Director != null)
        {
            movie.MoviePeople.Add(new MoviePerson
            {
                MovieId = movie.MovieId,
                PersonId = movieDto.Director.PersonId,
                Role = "Director"
            });
        }

        if (movieDto.Actors != null)
        {
            foreach (var actorDto in movieDto.Actors)
            {
                movie.MoviePeople.Add(new MoviePerson
                {
                    MovieId = movie.MovieId,
                    PersonId = actorDto.PersonId,
                    Role = "Actor"
                });
            }
        }

        translation.Title = movieDto.Title;
        translation.Story = movieDto.Story;
    }
}