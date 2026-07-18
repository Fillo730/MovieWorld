using MovieWorld.Dtos;
using MovieWorld.IMappers;
using MovieWorld.IRepositories;
using MovieWorld.IServices;

namespace MovieWorld.Services;

public class CartService(ICartRepository cartRepository, ICartMapper cartMapper, IOrdersMapper ordersMapper,
    IOrdersRepository ordersRepository, IEmailService emailService, ICouponService couponService) : ICartService
{
    private readonly ICartRepository _cartRepository = cartRepository;

    private readonly ICartMapper _cartMapper = cartMapper;

    private readonly IOrdersMapper _ordersMapper = ordersMapper;

    private readonly IOrdersRepository _ordersRepository = ordersRepository;

    private readonly IEmailService _emailService = emailService;

    private readonly ICouponService _couponService = couponService;

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

        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var subtotal = order.OrderItems.Sum(oi => oi.PurchasedPrice * oi.Quantity);

            var validationResult = await _couponService.ValidateCouponAsync(request.CouponCode, subtotal);

            if (!validationResult.IsValid)
            {
                throw new Exception(validationResult.ErrorMessage ?? "Codice sconto non valido.");
            }

            order.CouponCode = validationResult.Code;
            order.DiscountAmount = validationResult.DiscountAmount;
        }

        order = await _cartRepository.CreateOrderByUser(order);

        await _cartRepository.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(order.CouponCode))
        {
            await _couponService.IncrementCouponUsageAsync(order.CouponCode);
        }

        int id = order.OrderId;

        order = await _ordersRepository.GetByIdAsync(id);

        var orderDto = _ordersMapper.MapToDto(order, lang);

        if (orderDto.User.EmailNotificationsEnabled)
        {
            await _emailService.SendEmailAsync(
                orderDto.User.Email,
                orderDto.User.Name,
                $"Conferma ordine #{orderDto.Id} - MovieWorld",
                BuildOrderConfirmationEmailBody(orderDto));
        }

        return orderDto;
    }

    private static string BuildOrderConfirmationEmailBody(OrderDto order)
    {
        var itemsHtml = string.Join("", order.Items.Select(item =>
            $"<tr><td style=\"padding:8px 0;\">{item.Movie.Title}</td>" +
            $"<td style=\"padding:8px 0;text-align:center;\">{item.Quantity}</td>" +
            $"<td style=\"padding:8px 0;text-align:right;\">{item.Price * item.Quantity:C}</td></tr>"));

        return $@"
            <div style=""font-family:sans-serif;max-width:500px;margin:0 auto;"">
                <h2>Grazie per il tuo ordine, {order.User.Name}!</h2>
                <p>Il tuo ordine <strong>#{order.Id}</strong> del {order.Date:dd/MM/yyyy HH:mm} è stato registrato con successo.</p>
                <p><strong>Punto vendita:</strong> {order.SellPoint.Name} - {order.SellPoint.Address}, {order.SellPoint.City}</p>
                <table style=""width:100%;border-collapse:collapse;margin-top:16px;"">
                    <thead>
                        <tr style=""border-bottom:1px solid #ddd;"">
                            <th style=""text-align:left;padding:8px 0;"">Film</th>
                            <th style=""text-align:center;padding:8px 0;"">Qtà</th>
                            <th style=""text-align:right;padding:8px 0;"">Prezzo</th>
                        </tr>
                    </thead>
                    <tbody>{itemsHtml}</tbody>
                </table>
                {(order.DiscountAmount > 0
                    ? $@"<p style=""text-align:right;margin-top:16px;"">Subtotale: {order.TotalAmount:C}</p>
                        <p style=""text-align:right;color:#2e7d32;"">Sconto ({order.CouponCode}): -{order.DiscountAmount:C}</p>
                        <p style=""text-align:right;font-size:1.1em;""><strong>Totale: {order.FinalAmount:C}</strong></p>"
                    : $@"<p style=""text-align:right;font-size:1.1em;margin-top:16px;""><strong>Totale: {order.TotalAmount:C}</strong></p>")}
                <p style=""color:#888;font-size:0.9em;margin-top:24px;"">Puoi disattivare queste notifiche in qualsiasi momento dal tuo profilo.</p>
            </div>";
    }
}