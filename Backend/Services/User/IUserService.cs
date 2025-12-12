using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;

namespace Backend.Services.User
{
  public interface IUserService
  {
    Task<List<UserResponseDTO>> GetUsersAsync();
    Task<UserResponseDTO> GetUserAsync(int id);
    Task<UserResponseDTO> UpdateUserAsync(int id, UpdateUserServiceDTO updateUserDTO);
    Task<UserResponseDTO> UpdateUserRoleAsync(int id, UpdateUserRoleDTO updateUserRoleDto);

  }
}