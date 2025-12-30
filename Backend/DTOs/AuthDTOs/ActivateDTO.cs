using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.AuthDTOs
{
    public class ActivateDTO
    {
        [Required(ErrorMessage = "Token is required")]
        public required string Token { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character")]
        public required string Password { get; set; }
    }
}