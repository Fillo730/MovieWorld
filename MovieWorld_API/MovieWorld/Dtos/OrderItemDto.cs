namespace MovieWorld.Dtos;

public class OrderItemDto
{
    public MovieDto Movie { get; set; }
    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;
}
