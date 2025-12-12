using AutoMapper;
using Backend.Data;
using Backend.DTOs.RoleDTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Role
{
  public class RoleService : IRoleService
  {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
    public RoleService(DataContext context, IMapper mapper)
    {
      _context = context;
      _mapper = mapper;
    }

    public async Task<IEnumerable<RoleResponseDTO>> GetRolesAsync()
    {
      var roles = await _context.Roles.ToListAsync();
      return _mapper.Map<IEnumerable<RoleResponseDTO>>(roles);
    }
  }
}