using Backend.DTOs.AuthDTOs;
using Backend.Entities;

namespace Backend.DTOs.SkillDTOs
{
    public class SkillResponseDTO : SkillDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
