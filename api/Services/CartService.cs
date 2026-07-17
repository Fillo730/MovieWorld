using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;

namespace MovieWorld.Services;

public class CartService(ICartRepository cartRepository, ICartMapper cartMapper, IOrdersMapper ordersMapper, IOrdersRepository ordersRepository) : ICartService
{
    private readonly ICartRepository _cartRepository = cartRepository;

    private readonly ICartMapper _cartMapper = cartMapper;

    private readonly IOrdersMapper _ordersMapper = ordersMapper;  

    private readonly IOrdersRepository _ordersRepository = ordersRepository;

    public async Task<CartDto?> GetCartAsync(int userId, string lang)
    {
        var cart = await _cartRepository.GetCartByUserIdAsync(userId);

        return _cartMapper.MapToDto(cart, lang);
    }

    public async Task<CartDto?> AddOrUpdateItemAsync(int userId, int movieId, int quantity, string lang)
    {
        var cart = await _cartRepository.GetCartByUserIdAsync(userId);
        var updatedCart = await _cartRepository.AddOrUpdateItemAsync(userId, movieId, quantity);

        return _cartMapper.MapToDto(updatedCart, lang);
    }

    public async Task<CartDto?> RemoveItemAsync(int userId, int movieId, string lang)
    {
        var updatedCart = await _cartRepository.RemoveItemAsync(userId, movieId);

        return _cartMapper.MapToDto(updatedCart, lang);
    }

    public async Task<CartDto?> ClearCartAsync(int userId, string lang)
    {
        var updatedCart = await _cartRepository.ClearCartAsync(userId);

        return _cartMapper.MapToDto(updatedCart, lang);
    }

    public async Task<OrderDto> AddUserOrderAsync(int userId, OrderUserRequest request, string lang)
    {
        var order = _ordersMapper.MapUserRequestToDb(request, userId);

        order = await _cartRepository.CreateOrderByUser(order);

        await _cartRepository.SaveChangesAsync();

        int id = order.OrderId;

        order = await _ordersRepository.GetByIdAsync(id);

        return _ordersMapper.MapToDto(order, lang);
    }
}