using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.AuthDTOs
{
    public class UserDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }  // We can handle it securely later
    }
}
