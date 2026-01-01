using Backend.DTOs.PositionDTOs;
using Backend.Entities;

namespace Backend.Services.Position
{
    public interface IPositionService
    {
        Task<PositionResponseDTO> CreatePositionAsync(CreatePositionDTO createPositionDTO, int recruiterId);
        Task<PositionResponseDTO> GetPositionByIdAsync(int id, int userId);
        Task<IEnumerable<PositionResponseDTO>> GetAllPositionsAsync();
        Task<IEnumerable<PositionResponseDTO>> GetPositionsByRecruiterIdAsync(int recruiterId);
        Task<PositionResponseDTO> UpdatePositionAsync(int id, UpdatePositionDTO updatePositionDTO, int recruiterId);
        Task<bool> DeletePositionAsync(int id, int recruiterId);
        Task<PositionApplicationDTO> ApplyForPositionAsync(int positionId, int userId);
        Task<PositionApplicantsResponseDTO> GetPositionApplicantsAsync(int positionId, int recruiterId);
    }
}
