namespace MovieWorld.DTOs;

public class SellPointDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string Cap { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string Description { get; set; } = string.Empty;
    public double Distance { get; set; } = -1;

    public static List<string> GetExcellHeaders() => new()
    {
        "ID",
        "Nome",
        "Indirizzo",
        "Città",
        "Provincia",
        "CAP",
        "Latitudine",
        "Longitudine",
        "Descrizione",
        "Distanza (km)"
    };
}