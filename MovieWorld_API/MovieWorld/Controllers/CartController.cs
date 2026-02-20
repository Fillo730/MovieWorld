using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieWorld.Dtos;
using MovieWorld.IServices;
using MovieWorld.Models;
using System.Security.Claims;

namespace MovieWorld.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : BaseController
{
    private readonly ICartService _cartService = cartService;

    [HttpGet]
    public async Task<IActionResult> GetCart([FromQuery] string? lang)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var cart = await _cartService.GetCartAsync(userId, GetCurrentLanguage(lang));

            if (cart == null)
            {
                return Ok(ApiResponse<CartDto>.CreateFailureResponse("Carrello non trovato."));
            }

            return Ok(ApiResponse<CartDto>.CreateSuccessResponse(cart));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CartDto>.CreateFailureResponse($"Errore nel recupero del carrello: {ex.Message}"));
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddOrUpdateItem([FromBody] AddToCartRequest request, [FromQuery] string? lang)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.AddOrUpdateItemAsync(userId, request.MovieId, request.Quantity, GetCurrentLanguage(lang));

            return Ok(ApiResponse<CartDto>.CreateSuccessResponse(updatedCart));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CartDto>.CreateFailureResponse($"Errore durante l'aggiunta al carrello: {ex.Message}"));
        }
    }

    [HttpDelete("remove/{movieId}")]
    public async Task<IActionResult> RemoveItem(int movieId, [FromQuery] string? lang)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.RemoveItemAsync(userId, movieId, GetCurrentLanguage(lang));

            return Ok(ApiResponse<CartDto>.CreateSuccessResponse(updatedCart));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CartDto>.CreateFailureResponse($"Errore durante la rimozione dell'articolo: {ex.Message}"));
        }
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart([FromQuery] string? lang)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.ClearCartAsync(userId, GetCurrentLanguage(lang));

            return Ok(ApiResponse<CartDto>.CreateSuccessResponse(updatedCart));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<CartDto>.CreateFailureResponse($"Errore durante lo svuotamento del carrello: {ex.Message}"));
        }
    }

    [HttpPost("order")]
    public async Task<IActionResult> CreatUserOrderAsync([FromBody]OrderUserRequest request, [FromQuery] string? lang)
    {
        try
        {
            var userId = GetUserIdFromToken();

            var result = await _cartService.AddUserOrderAsync(userId, request, GetCurrentLanguage(lang));

            return Ok(ApiResponse<OrderDto>.CreateSuccessResponse(result));
        }
        catch(Exception ex)
        {
            return Ok(ApiResponse<OrderDto>.CreateFailureResponse(ex.Message));
        }
    }
}