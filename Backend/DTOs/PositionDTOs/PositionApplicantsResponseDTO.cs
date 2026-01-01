using Backend.DTOs.AuthDTOs;

namespace Backend.DTOs.PositionDTOs
{
    public class PositionApplicantsResponseDTO
    {
        public PositionResponseDTO Position { get; set; }
        public List<UserApplicantResponseDTO> Applicants { get; set; }
    }

    public class UserApplicantResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime? AppliedAt { get; set; }
    }
}
