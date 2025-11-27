using System.Text.Json.Serialization;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;

namespace Backend.DTOs.PositionDTOs
{
    public class PositionResponseDTO : PositionDTO
    {
        public int Id { get; set; }
        public int RecruiterId { get; set; }
        public UserResponseDTO? Recruiter { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public bool? Applied { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
