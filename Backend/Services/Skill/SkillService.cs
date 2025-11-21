using AutoMapper;
using Backend.Data;
using Backend.DTOs.SkillDTOs;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

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
}

}