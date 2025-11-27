using Backend.DTOs.SkillDTOs;

namespace Backend.Services.Skill
{
    public interface ISkillService
    {
        Task<SkillResponseDTO> CreateSkillAsync(CreateSkillDTO createSkillDTO);
        Task<SkillResponseDTO> GetSkillByIdAsync(int id);
        Task<IEnumerable<SkillResponseDTO>> GetAllSkillsAsync();
        Task<bool> DeleteSkillAsync(int id);
        Task<PositionSkillsResponseDTO> GetPositionSkillsAsync(int positionId);
        Task<PositionSkillsResponseDTO> AddSkillsToPositionAsync(List<int> skillIds, int positionId);
        Task<UserSkillsResponseDTO> AddSkillsToUserAsync(List<int> skillIds, int userId);
    }
}
