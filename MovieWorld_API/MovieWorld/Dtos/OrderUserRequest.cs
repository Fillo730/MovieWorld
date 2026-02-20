namespace MovieWorld.Dtos;

public class OrderUserRequest
{
    public int OrderStateId { get; set; } = 0;
    public int SellPointId { get; set; } = 0;

    public IEnumerable<OrderItemDto> Items { get; set; } = Enumerable.Empty<OrderItemDto>();
}
