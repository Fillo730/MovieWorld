namespace MovieWorld;

public class ApiResponse<T>
{
    public bool Success { get; set; }

    public string? Message { get; set; } = string.Empty;

    public T? Data { get; set; }

    public DateTime ResponseData { get; set; } = DateTime.UtcNow;

    public static ApiResponse<T> CreateSuccessResponse(T data, string message = "Success")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data

        };
    }

    public static ApiResponse<T> CreateFailureResponse(string message)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Data = default
        };
    }
}

