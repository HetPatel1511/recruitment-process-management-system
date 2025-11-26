using AutoMapper;
using Backend.Data;
using Backend.DTOs.PositionDTOs;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Position
{
    public class PositionService : IPositionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PositionService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PositionResponseDTO> CreatePositionAsync(CreatePositionDTO createPositionDTO, int recruiterId)
        {
            var position = _mapper.Map<Entities.Position>(createPositionDTO);
            position.RecruiterId = recruiterId;
            position.CreatedAt = DateTime.UtcNow;

            _context.Positions.Add(position);
            await _context.SaveChangesAsync();

            var response = _mapper.Map<PositionResponseDTO>(position);
            response.Recruiter = _mapper.Map<UserResponseDTO>(
                await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == recruiterId));

            return response;
        }

        public async Task<PositionResponseDTO> GetPositionByIdAsync(int id)
        {
            var position = await _context.Positions
                .Include(p => p.Recruiter)
                .ThenInclude(p => p.Role)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return _mapper.Map<PositionResponseDTO>(position);
        }

        public async Task<IEnumerable<PositionResponseDTO>> GetAllPositionsAsync()
        {
            var positions = await _context.Positions
                .Include(p => p.Recruiter)
                .ThenInclude(p => p.Role)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PositionResponseDTO>>(positions);
        }

        public async Task<IEnumerable<PositionResponseDTO>> GetPositionsByRecruiterIdAsync(int recruiterId)
        {
            var positions = await _context.Positions
                .Include(p => p.Recruiter)
                .ThenInclude(p => p.Role)
                .Where(p => p.RecruiterId == recruiterId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PositionResponseDTO>>(positions);
        }

        public async Task<PositionResponseDTO> UpdatePositionAsync(int id, UpdatePositionDTO updatePositionDTO, int recruiterId)
        {
            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == id && p.RecruiterId == recruiterId);

            if (position == null)
                throw new Exception("Position not found");

            _mapper.Map(updatePositionDTO, position);
            position.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = _mapper.Map<PositionResponseDTO>(position);
            response.Recruiter = _mapper.Map<UserResponseDTO>(
                await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == recruiterId));

            return response;
        }

        public async Task<bool> DeletePositionAsync(int id, int recruiterId)
        {
            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == id && p.RecruiterId == recruiterId);

            if (position == null)
                throw new Exception("Position not found");

            _context.Positions.Remove(position);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<PositionApplicationDTO> ApplyForPositionAsync(int positionId, int userId)
        {
            var position = await _context.Positions.FindAsync(positionId);
            if (position == null)
                throw new Exception("Position not found");
            if (position.Status != "open")
                throw new Exception("Position is closed");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var existingApplication = await _context.AuthPositions
                .FirstOrDefaultAsync(ap => ap.PositionId == positionId && ap.UserId == userId);
                
            if (existingApplication != null)
                throw new Exception("You have already applied for this position");

            var authPosition = new AuthPosition
            {
                UserId = userId,
                PositionId = positionId
            };

            _context.AuthPositions.Add(authPosition);
            await _context.SaveChangesAsync();

            return new PositionApplicationDTO
            {
                Id = authPosition.Id,
                User = _mapper.Map<UserResponseDTO>(authPosition.User),
                Position = _mapper.Map<PositionResponseDTO>(authPosition.Position),
                AppliedAt = authPosition.AppliedAt
            };
        }
    }
}
