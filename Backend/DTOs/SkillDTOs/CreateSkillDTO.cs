using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.SkillDTOs
{
    public class CreateSkillDTO 
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(5000)]
        public string? Description { get; set; }
    }
}
