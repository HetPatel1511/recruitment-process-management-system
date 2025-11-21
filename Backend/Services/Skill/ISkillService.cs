using Backend.DTOs.SkillDTOs;

namespace Backend.Services.Skill
{
    public interface ISkillService
    {
        Task<SkillResponseDTO> CreateSkillAsync(CreateSkillDTO createSkillDTO);
        Task<SkillResponseDTO> GetSkillByIdAsync(int id);
        Task<IEnumerable<SkillResponseDTO>> GetAllSkillsAsync();
        Task<bool> DeleteSkillAsync(int id);
    }
}
