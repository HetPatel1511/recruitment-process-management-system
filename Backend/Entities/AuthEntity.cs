using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [ForeignKey("Role")]
        public int RoleId { get; set; } = 6;

        public Role? Role { get; set; }

        public virtual ICollection<AuthPosition>? AuthPositions { get; set; }

        public virtual ICollection<UserSkill>? UserSkills { get; set; }

        [StringLength(2000)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Headline { get; set; }

        [StringLength(5000)]
        public string? About { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}