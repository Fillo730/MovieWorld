using MovieWorld.DTOs;
using MovieWorld.Models;

namespace MovieWorld.IMappers;

public interface ISellPointsMapper
{
    SellPointDto MapToDto(SellPoint sellPoint, string? lang);

    SellPointDto MapToDto(SellPoint sellPoint, string? lang, double? userLat, double? userLng);

    IEnumerable<SellPointDto> MapToDtoList(IEnumerable<SellPoint> sellPoints, string? lang);

    IEnumerable<SellPointDto> MapToDtoList(IEnumerable<SellPoint> sellPoints, string? lang, double userLat, double userLng);
}