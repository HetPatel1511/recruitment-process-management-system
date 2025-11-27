
using Backend.DTOs.AuthDTOs;

namespace Backend.DTOs.SkillDTOs
{
  public class UserSkillsResponseDTO
  {
    public UserResponseDTO User { get; set; }
    public IEnumerable<SkillResponseDTO> Skills { get; set; }
  }
}