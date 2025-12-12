using AutoMapper;
using Backend.Data;
using Backend.DTOs.SkillDTOs;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs.PositionDTOs;

namespace Backend.Services.Skill
{
    public class SkillService : ISkillService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SkillService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SkillResponseDTO> CreateSkillAsync(CreateSkillDTO createSkillDTO)
        {
            var skill = _mapper.Map<Entities.Skill>(createSkillDTO);
            var skillExists = await _context.Skills
                .AnyAsync(p => p.Name == createSkillDTO.Name);
            if (skillExists)
                throw new Exception("Skill already exists");
            skill.CreatedAt = DateTime.UtcNow;

            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            var response = _mapper.Map<SkillResponseDTO>(skill);
            return response;
        }

        public async Task<SkillResponseDTO> GetSkillByIdAsync(int id)
        {
            var skill = await _context.Skills
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return _mapper.Map<SkillResponseDTO>(skill);
        }

        public async Task<IEnumerable<SkillResponseDTO>> GetAllSkillsAsync()
        {
            var skills = await _context.Skills
                .ToListAsync();

            return _mapper.Map<IEnumerable<SkillResponseDTO>>(skills);
        }

        public async Task<bool> DeleteSkillAsync(int id)
        {
            var skill = await _context.Skills
                .FirstOrDefaultAsync(p => p.Id == id);

            if (skill == null)
                throw new Exception("Skill not found");

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<PositionSkillsResponseDTO> GetPositionSkillsAsync(int positionId)
        {
            
            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == positionId);
            if (position == null)
                throw new Exception("Position not found");

            var skills = await _context.PositionSkills
                .Where(ps => ps.PositionId == positionId)
                .Select(ps => ps.Skill)
                .ToListAsync();
            
            var skillsResponse = _mapper.Map<IEnumerable<SkillResponseDTO>>(skills);

            var positionResponse = _mapper.Map<PositionResponseDTO>(position);

            return new PositionSkillsResponseDTO
            {
                Skills = skillsResponse,
                Position = positionResponse
            };
        }

        public async Task<PositionSkillsResponseDTO> AddSkillsToPositionAsync(List<int> skillIds, int positionId)
        {
            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == positionId);

            if (position == null)
                throw new Exception("Position not found");

            var skills = await _context.Skills
                .Where(s => skillIds.Contains(s.Id))
                .ToListAsync();

            if (skills.Count != skillIds.Count)
                throw new Exception("One or more skills not found");

            var existingSkills = await _context.PositionSkills
                .Where(ps => ps.PositionId == positionId)
                .ToListAsync();

            var skillsToRemove = existingSkills
                .Where(ps => !skillIds.Contains(ps.SkillId))
                .ToList();

            if (skillsToRemove.Count > 0)
            {
                _context.PositionSkills.RemoveRange(skillsToRemove);
            }

            foreach (var skill in skills)
            {
                var skillExists = existingSkills
                    .Any(ps => ps.PositionId == positionId && ps.SkillId == skill.Id);
                if (skillExists)
                    continue;
                    
                _context.PositionSkills.Add(new PositionSkill
                {
                    PositionId = positionId,
                    SkillId = skill.Id
                });
            }
            await _context.SaveChangesAsync();

            var skillsResponse = _mapper.Map<IEnumerable<SkillResponseDTO>>(skills);
            var positionResponse = _mapper.Map<PositionResponseDTO>(position);

            return new PositionSkillsResponseDTO
            {
                Position = positionResponse,
                Skills = skillsResponse
            };
        }

        public async Task<UserSkillsResponseDTO> GetUserSkillsAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(p => p.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            var skills = await _context.UserSkills
                .Where(ps => ps.UserId == userId)
                .Select(ps => ps.Skill)
                .ToListAsync();

            var skillsResponse = _mapper.Map<IEnumerable<SkillResponseDTO>>(skills);
            var userResponse = _mapper.Map<UserResponseDTO>(user);

            return new UserSkillsResponseDTO
            {
                User = userResponse,
                Skills = skillsResponse
            };
        }

        public async Task<UserSkillsResponseDTO> AddSkillsToUserAsync(List<int> skillIds, int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(p => p.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            var skills = await _context.Skills
                .Where(s => skillIds.Contains(s.Id))
                .ToListAsync();

            if (skills.Count != skillIds.Count)
                throw new Exception("One or more skills not found");

            var existingSkills = await _context.UserSkills
                .Where(ps => ps.UserId == userId)
                .ToListAsync();

            var skillsToRemove = existingSkills
                .Where(ps => !skillIds.Contains(ps.SkillId))
                .ToList();

            if (skillsToRemove.Count > 0)
            {
                _context.UserSkills.RemoveRange(skillsToRemove);
            }

            foreach (var skill in skills)
            {
                var skillExists = existingSkills
                    .Any(ps => ps.SkillId == skill.Id);
                if (skillExists)
                    continue;
                    
                _context.UserSkills.Add(new UserSkill
                {
                    UserId = userId,
                    SkillId = skill.Id
                });
            }
            await _context.SaveChangesAsync();

            var skillsResponse = _mapper.Map<IEnumerable<SkillResponseDTO>>(skills);
            var userResponse = _mapper.Map<UserResponseDTO>(user);

            return new UserSkillsResponseDTO
            {
                User = userResponse,
                Skills = skillsResponse
            };
        }
}

}