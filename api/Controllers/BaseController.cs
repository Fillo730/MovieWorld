using Microsoft.AspNetCore.Mvc;
using MovieWorld.Constants;
using System.Security.Claims;

namespace MovieWorld.Controllers;


public class BaseController : ControllerBase
{
    protected string GetCurrentLanguage(string? lang)
    {
        return string.IsNullOrEmpty(lang) ? AppConstants.DefaultLanguage : lang;
    }
    
    protected int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst("userId")?.Value
                          ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new Exception("Token non valido o ID utente non trovato.");
        }

        return int.Parse(userIdClaim);
    }
}

