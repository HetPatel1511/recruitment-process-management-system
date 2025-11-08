using Backend.DTOs.PositionDTOs;
using Backend.Entities;

namespace Backend.Services.Position
{
    public interface IPositionService
    {
        Task<PositionResponseDTO> CreatePositionAsync(CreatePositionDTO createPositionDTO, int recruiterId);
        Task<PositionResponseDTO> GetPositionByIdAsync(int id);
        Task<IEnumerable<PositionResponseDTO>> GetAllPositionsAsync();
        Task<IEnumerable<PositionResponseDTO>> GetPositionsByRecruiterIdAsync(int recruiterId);
        Task<PositionResponseDTO> UpdatePositionAsync(int id, UpdatePositionDTO updatePositionDTO, int recruiterId);
        Task<bool> DeletePositionAsync(int id, int recruiterId);
    }
}
