using Backend.DTOs.RoleDTOs;

namespace Backend.Services.Role
{
  public interface IRoleService
  {
    Task<IEnumerable<RoleResponseDTO>> GetRolesAsync();
  }
}