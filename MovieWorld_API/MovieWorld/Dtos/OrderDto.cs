using MovieWorld.DTOs;
using MovieWorld.Models;

namespace MovieWorld.Dtos;

public class OrderDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public OrderStateDto State { get; set; }

    public UserDto User { get; set; }

    public SellPointDto SellPoint { get; set; }

    public decimal TotalAmount { get; set; } = 0;

    public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
}