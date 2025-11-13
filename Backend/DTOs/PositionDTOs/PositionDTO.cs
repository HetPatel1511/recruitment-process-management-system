using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.PositionDTOs
{
    public class PositionDTO
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(5000)]
        public string? Description { get; set; }
        
        [Required]
        public string Status { get; set; } = "open";
        
        public string? ReasonForClosure { get; set; }

        [Range(0, 50)]
        public int? YearsOfExperienceRequired { get; set; }
    }
}
