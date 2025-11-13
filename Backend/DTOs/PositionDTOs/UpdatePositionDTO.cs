using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.PositionDTOs
{
    public class UpdatePositionDTO
    {
        [StringLength(5000)]
        public string? Description { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }
        
        [StringLength(500)]
        public string? ReasonForClosure { get; set; }
        
        [Range(0, 50)]
        public int? YearsOfExperienceRequired { get; set; }
    }
}
