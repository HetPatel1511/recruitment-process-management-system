using System.Text.Json.Serialization;

namespace Backend.DTOs.AuthDTOs
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public RoleDTO Role { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Headline { get; set; } = string.Empty;
        public string About { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }


        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? AccessToken { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? RefreshToken { get; set; }
    }

    public class RoleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
