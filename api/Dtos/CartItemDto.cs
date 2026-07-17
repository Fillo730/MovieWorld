namespace MovieWorld.Dtos;

public class CartItemDto
{
    public int MovieId { get; set; }
    public MovieDto? Movie { get; set; }
    public int Quantity { get; set; }
}
