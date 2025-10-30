using System.Text.Json.Serialization;

namespace Backend.DTOs.AuthDTOs
{
  public class RefreshDTO
  {
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? AccessToken { get; set; }
    
    public string RefreshToken { get; set; }
  }
}