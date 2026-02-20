namespace MovieWorld.Dtos;

public class OrdersFilterDto
{
    public int Year { get; set; }

    public int OrderStateId { get; set; } 

    public int MoviesNumber { get; set; }

    public int MaxTotalPrice { get; set; }

    public int MinTotalPrice { get; set; }

}
