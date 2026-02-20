using MovieWorld.Dtos;

namespace MovieWorld.Dtos
{
    public class NewsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public List<MovieDto> RelatedMovies { get; set; } = new();
        public List<PersonDto> RelatedActors { get; set; } = new();
    }
}