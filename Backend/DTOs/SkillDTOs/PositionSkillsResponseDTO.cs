using Backend.DTOs.PositionDTOs;

namespace Backend.DTOs.SkillDTOs
{
  public class PositionSkillsResponseDTO
  {
    public PositionResponseDTO Position { get; set; }
    public IEnumerable<SkillResponseDTO> Skills { get; set; }
  }
}