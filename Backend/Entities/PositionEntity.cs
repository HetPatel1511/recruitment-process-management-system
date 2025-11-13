using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class Position
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [ForeignKey("Recruiter")]
        public int RecruiterId { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "open";

        [StringLength(5000)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? ReasonForClosure { get; set; }

        [Range(0, 50)]
        public int? YearsOfExperienceRequired { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public User? Recruiter { get; set; }
    }
}