using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.PositionDTOs
{
    public class CreatePositionDTO 
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(5000)]
        public string Description { get; set; }

        [Required]
        [Range(0, 50)]
        public int YearsOfExperienceRequired { get; set; }
    }
}
