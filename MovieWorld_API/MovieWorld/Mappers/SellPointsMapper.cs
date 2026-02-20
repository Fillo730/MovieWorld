using MovieWorld.DTOs;
using MovieWorld.IMappers;
using MovieWorld.Models;
using MovieWorld.Utils;

namespace MovieWorld.Mappers;

public class SellPointsMapper : ISellPointsMapper
{
    public SellPointDto MapToDto(SellPoint sellPoint, string? lang)
    {
        return InternalMap(sellPoint, lang, null, null);
    }

    public SellPointDto MapToDto(SellPoint sellPoint, string? lang, double? userLat, double? userLng)
    {
        return InternalMap(sellPoint, lang, userLat, userLng);
    }

    private SellPointDto InternalMap(SellPoint sellPoint, string? lang, double? userLat, double? userLng)
    {
        var translation = sellPoint.SellPointTranslations?
            .FirstOrDefault(t => t.LanguageCode == lang);

        double distance = -1;

        if (userLat.HasValue && userLng.HasValue)
        {
            distance = DistanceFunctions.CalculateDistance(
                userLat.Value,
                userLng.Value,
                sellPoint.Lat ?? 0,
                sellPoint.Lng ?? 0
            );
        }

        return new SellPointDto
        {
            Id = sellPoint.SellPointId,
            Name = sellPoint.Name,
            Province = sellPoint.Province,
            Cap = sellPoint.Cap,
            Lat = sellPoint.Lat ?? 0,
            Lng = sellPoint.Lng ?? 0,
            Address = translation?.Address ?? string.Empty,
            Description = translation?.Description ?? string.Empty,
            City = translation?.City ?? string.Empty,
            Distance = distance
        };
    }

    public IEnumerable<SellPointDto> MapToDtoList(IEnumerable<SellPoint> sellPoints, string? lang)
    {
        return sellPoints.Select(sp => MapToDto(sp, lang)).ToList();
    }

    public IEnumerable<SellPointDto> MapToDtoList(IEnumerable<SellPoint> sellPoints, string? lang, double userLat, double userLng)
    {
        return sellPoints.Select(sp => MapToDto(sp, lang, userLat, userLng)).ToList();
    }
}